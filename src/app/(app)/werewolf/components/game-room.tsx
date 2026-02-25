'use client';

import { useEffect, useState, useRef } from 'react';
import { WerewolfGameModel, WerewolfPlayerModel } from '@/db/schema';
import { refreshGameState } from '../actions/refresh';
import { startGame, nextPhase, submitAction, eliminatePlayer } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
    initialGame: WerewolfGameModel;
    initialPlayers: WerewolfPlayerModel[];
    me: WerewolfPlayerModel;
};

export default function GameRoom({ initialGame, initialPlayers, me }: Props) {
    const [game, setGame] = useState(initialGame);
    const [players, setPlayers] = useState(initialPlayers);
    const [error, setError] = useState<string | null>(null);

    // Ref to track last phase so we can read out the TTS properly
    const previousPhaseRef = useRef(initialGame.phase);

    useEffect(() => {
        const sse = new EventSource(`/werewolf/${game.id}/stream`);

        sse.onmessage = async (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'update') {
                    const fresh = await refreshGameState(game.id);
                    setGame(fresh.game);
                    setPlayers(fresh.players);
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
    }, [game.id]);

    useEffect(() => {
        // Handle Web Speech API / Narrator for Game Owner
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

    const handleStartGame = async () => {
        try {
            await startGame(game.id);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleNextPhase = async (phase: string) => {
        try {
            await nextPhase(game.id, phase);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleAction = async (targetId: string) => {
        try {
            await submitAction(game.id, targetId);
        } catch (e: any) {
            setError(e.message);
        }
    };

    const handleEliminate = async (targetId: string) => {
        try {
            await eliminatePlayer(game.id, targetId);
        } catch (e: any) {
            setError(e.message)
        }
    }

    // Derived state
    const isNight = game.phase === 'night';
    const isDay = game.phase === 'day';
    const isVoting = game.phase === 'voting';
    const myTarget = players.find(p => p.id === me.actionTargetId);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">Werwolf</h1>
                    <p className="text-slate-400">Game Code: <span className="font-mono text-white">{game.id}</span></p>
                </div>
                <div className="text-right">
                    <p className="text-slate-300">Du bist: <span className="font-semibold text-white">{me.name}</span></p>
                    {me.role && (
                        <p className="text-slate-400">Rolle: <span className="font-semibold text-rose-400 uppercase">{me.role}</span></p>
                    )}
                    {!me.isAlive && <p className="text-red-500 font-bold mt-1">Gekillt 💀</p>}
                </div>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-2 rounded-md">
                    {error}
                </div>
            )}

            {/* GAME BOARD */}
            {game.status === 'lobby' && (
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle>Lobby - Warten auf Spieler</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-2">
                            {players.map(p => (
                                <li key={p.id} className="flex justify-between items-center bg-slate-800 px-4 py-2 rounded">
                                    <span>{p.name} {p.isOwner && '(Owner)'}</span>
                                </li>
                            ))}
                        </ul>
                        {me.isOwner && (
                            <Button onClick={handleStartGame} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">Spiel Starten</Button>
                        )}
                        {!me.isOwner && (
                            <p className="text-slate-400 text-center animate-pulse">Warten auf Game Owner...</p>
                        )}
                    </CardContent>
                </Card>
            )}

            {game.status === 'in_progress' && (
                <>
                    <div className="bg-slate-900 p-4 border border-slate-800 rounded-lg text-center">
                        <h2 className="text-2xl font-bold uppercase tracking-wider text-indigo-400">Phase: {game.phase}</h2>
                        {isNight && <p className="text-slate-400 mt-2">Das Dorf schläft. Wölfe, Seherin und Hexe, macht eure Augen auf (bzw. wählt unten eure Opfer).</p>}
                        {isDay && <p className="text-slate-400 mt-2">Das Dorf ist wach. Diskutiert, wer nachts verdächtige Geräusche gemacht hat!</p>}
                        {isVoting && <p className="text-slate-400 mt-2">Wählt denjenigen aus, der hängen soll!</p>}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {players.map(p => {
                            const isActive = p.id === me.actionTargetId;
                            const isMe = p.id === me.id;

                            // Simplistic targeting logic:
                            // Wolfs can target anyone alive in the night
                            // Everyone can target anyone alive in voting
                            const canAction = me.isAlive && p.isAlive && !isMe && (
                                (isNight && me.role === 'werwolf') || // only werwolf acts for now as simple mockup
                                (isNight && me.role === 'hexe') ||
                                (isNight && me.role === 'seher') ||
                                isVoting
                            );

                            return (
                                <Card key={p.id} className={`bg-slate-900 border-slate-800 ${!p.isAlive ? 'opacity-50' : ''}`}>
                                    <CardContent className="p-4 flex justify-between items-center flex-col gap-3">
                                        <div className="text-center">
                                            <p className="font-semibold text-lg">{p.name}</p>
                                            {!p.isAlive && <span className="text-red-500 text-xs uppercase font-bold">Tot</span>}
                                            {me.isOwner && p.actionTargetId && (
                                                <p className="text-xs text-indigo-300 mt-1">Zielt auf jemand</p>
                                            )}
                                        </div>
                                        {canAction && (
                                            <Button
                                                size="sm"
                                                variant={isActive ? 'default' : 'outline'}
                                                onClick={() => handleAction(p.id)}
                                                className={`w-full ${isActive ? 'bg-indigo-600' : 'border-indigo-600 text-indigo-400'}`}
                                            >
                                                {isActive ? 'Ziel ausgewählt' : 'Auswählen'}
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </>
            )}

            {/* OWNER CONTROLS - Fixed at bottom */}
            {me.isOwner && game.status === 'in_progress' && (
                <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-slate-800 bg-slate-950/90 backdrop-blur z-50">
                    <div className="max-w-4xl mx-auto">
                        <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">Erweiterte Owner Kontrollen</p>
                        <div className="flex gap-2 flex-wrap">
                            <Button onClick={() => handleNextPhase('day')} variant="secondary">In Tag wechseln</Button>
                            <Button onClick={() => handleNextPhase('voting')} variant="secondary">In Voting wechseln</Button>
                            <Button onClick={() => handleNextPhase('night')} variant="secondary">In Nacht wechseln</Button>
                        </div>

                        <div className="mt-4">
                            <p className="text-xs text-slate-400 mb-2 uppercase font-bold tracking-wider">Spieler Eliminieren (Manuell)</p>
                            <div className="flex gap-2 flex-wrap">
                                {players.filter(p => p.isAlive).map(p => (
                                    <Button key={p.id} size="sm" variant="destructive" onClick={() => handleEliminate(p.id)}>
                                        Kill {p.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
