'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { WerewolfGameModel, WerewolfPlayerModel } from '@/db/schema';
import { refreshGameState } from '../actions/refresh';
import { startGame, nextPhase, submitAction } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Settings,
  ShieldAlert,
  Skull,
  Eye,
  Moon,
  Sun,
  Vote,
  UserCircle2,
  Users,
  Minus,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Props = {
  initialGame: WerewolfGameModel;
  initialPlayers: WerewolfPlayerModel[];
  me: WerewolfPlayerModel;
};

const PHASE_LABELS: Record<string, string> = {
  night: 'Nacht',
  day: 'Tag',
  voting: 'Abstimmung',
};

export default function GameRoom({ initialGame, initialPlayers, me: initialMe }: Props) {
  const [game, setGame] = useState(initialGame);
  const [players, setPlayers] = useState(initialPlayers);
  const [me, setMe] = useState(initialMe);
  const [error, setError] = useState<string | null>(null);
  const [newPlayerNames, setNewPlayerNames] = useState<string[]>([]);
  const [peekedInfo, setPeekedInfo] = useState<{ name: string; role: string } | null>(null);
  const router = useRouter();

  const [roleConfig, setRoleConfig] = useState<Record<string, number>>(() => {
    const existing = (initialGame.rolesConfig as Record<string, number>) || {};
    return {
      werwolf: existing.werwolf ?? 1,
      dorfbewohner: existing.dorfbewohner ?? 0,
      seher: existing.seher ?? 0,
      hexe: existing.hexe ?? 0,
      jaeger: existing.jaeger ?? 0,
      amor: existing.amor ?? 0,
      heiler: existing.heiler ?? 0,
      blinzelmaedchen: existing.blinzelmaedchen ?? 0,
      dorfdepp: existing.dorfdepp ?? 0,
      der_alte: existing.der_alte ?? 0,
      wildes_kind: existing.wildes_kind ?? 0,
    };
  });

  const updateRole = (role: string, delta: number) => {
    setRoleConfig((prev) => ({
      ...prev,
      [role]: Math.max(0, (prev[role] || 0) + delta),
    }));
  };

  const previousPhaseRef = useRef(initialGame.phase);
  const previousStatusRef = useRef(initialGame.status);
  const previousPlayerIdsRef = useRef(new Set(initialPlayers.map((p) => p.id)));

  const handleGameUpdate = useCallback(async () => {
    try {
      const fresh = await refreshGameState(game.id);
      const prevStatus = previousStatusRef.current;
      previousStatusRef.current = fresh.game.status;
      setGame(fresh.game);
      setPlayers(fresh.players);

      // Update `me` from the fresh players
      const freshMe = fresh.players.find((p) => p.id === initialMe.id);
      if (freshMe) {
        setMe(freshMe);
      }

      // If the game just started, redirect all players
      if (prevStatus === 'lobby' && fresh.game.status === 'in_progress') {
        router.refresh();
      }

      // Show notification for new players (admin only)
      if (initialMe.isOwner && fresh.game.status === 'lobby') {
        const freshIds = new Set(fresh.players.map((p) => p.id));
        const newPlayers = fresh.players.filter((p) => !previousPlayerIdsRef.current.has(p.id));
        if (newPlayers.length > 0) {
          const newNames = newPlayers.map((p) => p.name);
          setNewPlayerNames((prev) => [...prev, ...newNames]);
          setTimeout(() => {
            setNewPlayerNames((prev) => prev.slice(newNames.length));
          }, 4000);
        }
        previousPlayerIdsRef.current = freshIds;
      }
    } catch (err) {
      console.error('Failed to refresh game state', err);
    }
  }, [game.id, initialMe.id, initialMe.isOwner, router]);

  useEffect(() => {
    const sse = new EventSource(`/werewolf/${game.id}/stream`);

    sse.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'update' || data.type === 'connected') {
          await handleGameUpdate();
        }
      } catch (err) {
        console.error('Failed to parse SSE', err);
      }
    };

    sse.onerror = () => {
      console.warn('SSE connection lost, reconnecting...');
    };

    return () => {
      sse.close();
    };
  }, [game.id, handleGameUpdate]);

  useEffect(() => {
    if (!me.isOwner) return;

    if (game.phase !== previousPhaseRef.current) {
      previousPhaseRef.current = game.phase;

      let textToSpeak = '';
      if (game.phase === 'night') {
        textToSpeak = 'Das Dorf schläft ein. Niemand hat mehr die Augen offen.';
      } else if (game.phase === 'day') {
        textToSpeak = 'Das Dorf erwacht. Die Sonne geht auf.';
      } else if (game.phase === 'voting') {
        textToSpeak = 'Das Dorf ist sich uneinig. Es ist Zeit abzustimmen, wer gehängt wird.';
      }

      if (textToSpeak && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'de-DE';
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [game.phase, me.isOwner]);

  const totalRoles = Object.values(roleConfig).reduce((a, b) => a + b, 0);
  const werewolfCount = roleConfig.werwolf || 0;
  const maxWerwolf = Math.floor(players.length / 2);
  const canStart =
    totalRoles === players.length &&
    players.length >= 4 &&
    werewolfCount >= 1 &&
    werewolfCount <= maxWerwolf;

  const handleStartGame = async () => {
    setError(null);
    try {
      await startGame(game.id, roleConfig);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fehler beim Starten');
    }
  };

  const handleAction = async (targetId: string, actionType?: string) => {
    try {
      const result = await submitAction(game.id, targetId, actionType);
      if (actionType === 'peek' && result.peekedRole && result.peekedName) {
        setPeekedInfo({ name: result.peekedName, role: result.peekedRole });
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fehler');
    }
  };

  const isNight = game.phase === 'night';
  const isDay = game.phase === 'day';
  const isVoting = game.phase === 'voting';

  // Dynamic Backgrounds
  const backgroundClass = isNight
    ? 'bg-slate-950/90 from-indigo-950/50 to-slate-950'
    : isDay
      ? 'bg-sky-950/80 from-sky-900/40 to-slate-900'
      : isVoting
        ? 'bg-slate-900/90 from-rose-950/40 to-slate-900'
        : 'bg-slate-950 from-slate-900 to-slate-950';

  const avatarUrl = (role: string | null) => {
    if (!role) return null;
    if (role === 'werwolf') return '/werewolf/werewolf.png';
    return null;
  };

  const roleColor = (role: string | null) => {
    switch (role) {
      case 'werwolf':
        return 'text-red-400';
      case 'seher':
        return 'text-purple-400';
      case 'hexe':
        return 'text-emerald-400';
      default:
        return 'text-slate-300';
    }
  };

  const roleLabel = (role: string | null) => {
    const labels: Record<string, string> = {
      werwolf: 'Werwolf',
      dorfbewohner: 'Dorfbewohner',
      seher: 'Seherin',
      hexe: 'Hexe',
      jaeger: 'Jäger',
      amor: 'Amor',
      heiler: 'Heiler',
      blinzelmaedchen: 'Blinzelmädchen',
      dorfdepp: 'Dorfdepp',
      der_alte: 'Der Alte',
      wildes_kind: 'Wildes Kind',
    };
    return role ? (labels[role] ?? role) : null;
  };

  return (
    <div
      className={`min-h-[100dvh] bg-gradient-to-b ${backgroundClass} text-slate-50 transition-colors duration-1000 relative overflow-hidden`}
    >
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* New Player Join Notification Toast */}
      {newPlayerNames.length > 0 && (
        <div className="fixed top-4 right-4 z-100 space-y-2 animate-in slide-in-from-right-8 fade-in duration-300">
          {newPlayerNames.map((name, i) => (
            <div
              key={`toast-${i}`}
              className="bg-emerald-600/90 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-500/50"
            >
              <Users className="w-4 h-4" />
              <span className="font-semibold">{name}</span>
              <span className="text-emerald-200 text-sm">ist beigetreten!</span>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8 relative z-10 animate-in fade-in duration-500">
        {error && (
          <div className="bg-red-950/80 border border-red-500 text-red-200 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-top-2 shadow-lg flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}

        {/* LOBBY PHASE */}
        {game.status === 'lobby' && (
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/60 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full mb-2">
              <Users className="w-12 h-12 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold">Warten auf Spieler</h2>

            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/80 space-y-2 text-left">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center bg-slate-900 px-4 py-3 rounded-lg border border-slate-800 animate-in fade-in slide-in-from-left-2 duration-300"
                >
                  <span className="font-medium flex items-center gap-2">
                    <UserCircle2 className="w-5 h-5 text-slate-500" />
                    {p.name}
                  </span>
                  {p.isOwner && (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                      OWNER
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Player count indicator */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <Users className="w-4 h-4 text-slate-500" />
              <span className="text-slate-400">{players.length} Spieler im Raum</span>
              {players.length < 4 && (
                <span className="text-amber-400 text-xs">(min. 4 benötigt)</span>
              )}
            </div>

            {me.isOwner ? (
              <div className="space-y-6">
                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/80 text-left">
                  <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <Settings className="w-4 h-4" /> Rollen Setup
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { id: 'werwolf', label: 'Werwolf', required: true },
                      { id: 'dorfbewohner', label: 'Dorfbewohner' },
                      { id: 'seher', label: 'Seherin' },
                      { id: 'hexe', label: 'Hexe' },
                      { id: 'jaeger', label: 'Jäger' },
                      { id: 'amor', label: 'Amor' },
                      { id: 'heiler', label: 'Heiler' },
                      { id: 'blinzelmaedchen', label: 'Blinzelmädchen' },
                      { id: 'dorfdepp', label: 'Dorfdepp' },
                      { id: 'der_alte', label: 'Der Alte' },
                      { id: 'wildes_kind', label: 'Wildes Kind' },
                    ].map((r) => (
                      <div
                        key={r.id}
                        className={`flex justify-between items-center bg-slate-900 border px-3 py-2 rounded-lg ${r.required ? 'border-slate-700' : 'border-slate-800'}`}
                      >
                        <span className="text-sm font-medium text-slate-300 flex items-center gap-1">
                          {r.label}
                          {r.required && <span className="text-amber-400 text-[10px]">*</span>}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateRole(r.id, -1)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-4 text-center text-sm font-bold">
                            {roleConfig[r.id] || 0}
                          </span>
                          <button
                            onClick={() => updateRole(r.id, 1)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-sm text-slate-500 text-center flex flex-col items-center gap-2">
                    <div className="flex items-center gap-4">
                      <span>
                        Summe Rollen:{' '}
                        <span
                          className={`font-bold ${totalRoles === players.length ? 'text-emerald-400' : 'text-red-400'}`}
                        >
                          {totalRoles}
                        </span>
                      </span>
                      <span>
                        Spieler: <span className="text-slate-300 font-bold">{players.length}</span>
                      </span>
                    </div>
                    {totalRoles !== players.length && (
                      <div className="flex items-center gap-1 text-amber-400 text-xs animate-in fade-in duration-200">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Rollenanzahl muss exakt der Spieleranzahl entsprechen</span>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleStartGame}
                  size="lg"
                  disabled={!canStart}
                  className={`w-full text-lg h-14 shadow-lg transition-transform active:scale-95 ${canStart
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'
                    : 'bg-slate-700 cursor-not-allowed opacity-60'
                    }`}
                >
                  {!canStart ? (
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      {players.length < 4
                        ? 'Zu wenig Spieler'
                        : werewolfCount < 1
                          ? 'Mindestens 1 Werwolf'
                          : werewolfCount > maxWerwolf
                            ? `Max. ${maxWerwolf} Werwölfe erlaubt`
                            : totalRoles !== players.length
                              ? `Rollen anpassen (${totalRoles}/${players.length})`
                              : 'Konfiguration prüfen'}
                    </span>
                  ) : (
                    'Spiel Starten'
                  )}
                </Button>
              </div>
            ) : (
              <p className="text-slate-400 text-sm animate-pulse flex justify-center items-center gap-2">
                <Settings className="w-4 h-4 animate-spin" /> Der Owner muss das Spiel starten...
              </p>
            )}
          </div>
        )}

        {/* IN PROGRESS PHASE */}
        {game.status === 'in_progress' && (
          <div className="space-y-8">
            <div className="text-center space-y-4 animate-in zoom-in-95 duration-500">

              <h2 className="text-3xl font-black uppercase tracking-widest text-slate-200">
                Phase: {PHASE_LABELS[game.phase] || game.phase}
              </h2>
              <div className="max-w-lg mx-auto bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 rounded-xl shadow-inner">
                {isNight && (
                  <p className="text-indigo-200">
                    Das Dorf schläft. Wölfe, Seherin und Hexe: wählt eure Ziele in der Stille der
                    Nacht.
                  </p>
                )}
                {isDay && (
                  <p className="text-amber-200">
                    Das Dorf ist erwacht. Diskutiert, wer sich nachts merkwürdig verhalten hat!
                  </p>
                )}
                {isVoting && (
                  <p className="text-rose-200 font-medium">
                    Es ist Zeit zu entscheiden. Zeigt auf die Person, die ihr verdächtigt!
                  </p>
                )}
              </div>

              {isDay && me.isOwner && (
                <Button
                  onClick={async () => {
                    setError(null);
                    try {
                      await nextPhase(game.id);
                    } catch (e: unknown) {
                      setError(e instanceof Error ? e.message : 'Fehler beim Phasenwechsel');
                    }
                  }}
                  size="lg"
                  className="bg-rose-600 hover:bg-rose-700 text-white shadow-lg transition-transform active:scale-95"
                >
                  <Vote className="w-5 h-5 mr-2" />
                  Start Abstimmung
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {players.map((p) => {
                const isActive = p.id === me.actionTargetId;
                const isMe = p.id === me.id;
                const isDeadHunter = !me.isAlive && me.role === 'jaeger';
                const canTarget = p.isAlive && !isMe;

                const canAction =
                  canTarget &&
                  ((isNight &&
                    ['werwolf', 'hexe', 'seher', 'heiler', 'amor', 'wildes_kind'].includes(
                      me.role || '',
                    )) ||
                    (isVoting && me.isAlive) ||
                    isDeadHunter);

                let actionUI = <div className="h-9" />; // Placeholder
                if (canAction) {
                  if (isVoting && me.isAlive) {
                    actionUI = (
                      <Button
                        size="sm"
                        onClick={() => handleAction(p.id, 'vote')}
                        variant={isActive ? 'default' : 'secondary'}
                        className="w-full text-rose-500 border-rose-500/30 hover:bg-rose-500 hover:text-white"
                      >
                        Abstimmen
                      </Button>
                    );
                  } else if (isDeadHunter) {
                    actionUI = (
                      <Button
                        size="sm"
                        onClick={() => handleAction(p.id, 'shoot')}
                        variant={isActive ? 'default' : 'secondary'}
                        className="w-full text-amber-500 border-amber-500/30 hover:bg-amber-500 hover:text-white"
                      >
                        Erschießen
                      </Button>
                    );
                  } else if (isNight) {
                    if (me.role === 'werwolf') {
                      actionUI = (
                        <Button
                          size="sm"
                          onClick={() => handleAction(p.id, 'kill')}
                          variant={isActive ? 'default' : 'secondary'}
                          className={`w-full ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}
                        >
                          Fressen
                        </Button>
                      );
                    } else if (me.role === 'hexe') {
                      const isHeal = isActive && me.actionType === 'heal';
                      const isKill = isActive && me.actionType === 'kill';
                      actionUI = (
                        <div className="flex gap-2 w-full">
                          <Button
                            size="sm"
                            onClick={() => handleAction(p.id, 'heal')}
                            variant={isHeal ? 'default' : 'secondary'}
                            className={`flex-1 ${isHeal ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-800 hover:bg-emerald-900/50 text-emerald-400'}`}
                          >
                            Heilen
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAction(p.id, 'kill')}
                            variant={isKill ? 'destructive' : 'secondary'}
                            className={`flex-1 ${isKill ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-red-900/50 text-red-400'}`}
                          >
                            Kill
                          </Button>
                        </div>
                      );
                    } else if (me.role === 'seher') {
                      actionUI = (
                        <Button
                          size="sm"
                          onClick={() => handleAction(p.id, 'peek')}
                          variant={isActive ? 'default' : 'secondary'}
                          className={`w-full ${isActive ? 'bg-purple-600 text-white' : 'bg-slate-800 text-purple-400'}`}
                        >
                          Ansehen
                        </Button>
                      );
                    } else if (me.role === 'heiler') {
                      actionUI = (
                        <Button
                          size="sm"
                          onClick={() => handleAction(p.id, 'protect')}
                          variant={isActive ? 'default' : 'secondary'}
                          className={`w-full ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-800 text-blue-400'}`}
                        >
                          Beschützen
                        </Button>
                      );
                    } else if (me.role === 'amor') {
                      actionUI = (
                        <Button
                          size="sm"
                          onClick={() => handleAction(p.id, 'love')}
                          variant={isActive ? 'default' : 'secondary'}
                          className={`w-full ${isActive ? 'bg-pink-600 text-white' : 'bg-slate-800 text-pink-400'}`}
                        >
                          Verlieben
                        </Button>
                      );
                    } else if (me.role === 'wildes_kind') {
                      actionUI = (
                        <Button
                          size="sm"
                          onClick={() => handleAction(p.id, 'role_model')}
                          variant={isActive ? 'default' : 'secondary'}
                          className={`w-full ${isActive ? 'bg-orange-600 text-white' : 'bg-slate-800 text-orange-400'}`}
                        >
                          Vorbild
                        </Button>
                      );
                    }
                  }
                }

                const hasAvatar = avatarUrl(p.role) !== null;

                return (
                  <Card
                    key={p.id}
                    className={`overflow-hidden transition-all duration-300 border-2 ${isActive ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105 bg-slate-900' : 'border-slate-800 bg-slate-900/60 backdrop-blur-md'} ${!p.isAlive ? 'opacity-40 grayscale' : 'hover:border-slate-600'}`}
                  >
                    <CardContent className="p-0 flex flex-col items-center h-full">
                      {/* Avatar Placeholder / Image */}
                      <div className="w-full h-32 bg-slate-950/50 relative flex justify-center items-center border-b border-slate-800/50">
                        {p.isAlive ? (
                          hasAvatar && (isMe || !isNight) ? (
                            isMe ? (
                              <Image
                                src={avatarUrl(p.role)!}
                                alt={p.role!}
                                width={80}
                                height={80}
                                className="rounded-full border-2 border-slate-700 shadow-lg"
                              />
                            ) : (
                              <UserCircle2 className="w-16 h-16 text-slate-700" />
                            )
                          ) : (
                            <UserCircle2 className="w-16 h-16 text-slate-700" />
                          )
                        ) : (
                          <Skull className="w-16 h-16 text-red-500/50" />
                        )}

                        {me.isOwner && p.actionTargetId && (
                          <div className="absolute top-2 right-2 bg-indigo-500/80 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow flex items-center gap-1 backdrop-blur-sm">
                            <Eye className="w-3 h-3" />
                            {p.actionType || 'Active'}
                          </div>
                        )}
                      </div>

                      <div className="p-4 w-full flex flex-col justify-between flex-1 gap-4">
                        <div className="text-center">
                          <p className="font-bold text-lg text-slate-200 truncate">{p.name}</p>
                          {!p.isAlive && (
                            <span className="text-red-500 text-[10px] uppercase font-bold tracking-widest bg-red-500/10 px-2 py-0.5 rounded-full inline-block mt-1">
                              Gekillt
                            </span>
                          )}
                          {isMe && (
                            <span className="text-indigo-400 text-[10px] uppercase font-bold tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded-full inline-block mt-1">
                              DU
                            </span>
                          )}
                          {isMe && me.role && (
                            <p className={`text-sm font-bold uppercase tracking-wide mt-1 ${roleColor(me.role)}`}>
                              {roleLabel(me.role)}
                            </p>
                          )}
                        </div>

                        <div className="mt-auto">{actionUI}</div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Seherin Peek Result Modal */}
      {peekedInfo && (
        <div className="fixed inset-0 z-200 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-purple-700/50 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl space-y-5 animate-in zoom-in-95 duration-300 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-purple-500/10 rounded-full">
              <Eye className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm uppercase tracking-widest font-semibold mb-1">
                Seherin — Deine Vision
              </p>
              <p className="text-2xl font-extrabold text-white">{peekedInfo.name}</p>
              <p className={`text-xl font-bold uppercase tracking-wide mt-2 ${roleColor(peekedInfo.role)}`}>
                {roleLabel(peekedInfo.role)}
              </p>
            </div>
            <Button
              onClick={() => setPeekedInfo(null)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              Verstanden
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
