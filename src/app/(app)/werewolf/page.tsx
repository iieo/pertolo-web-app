'use client';

import { createGame, joinGame } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Moon, Users, Swords } from 'lucide-react';

export default function WerewolfLobby() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-slate-950 text-slate-50 p-4 md:p-6 relative overflow-hidden">
            {/* Background glowing effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-slate-900 rounded-full blur-[120px] opacity-50 pointer-events-none" />
            <div className="absolute top-10 right-10 w-64 h-64 bg-indigo-900/30 rounded-full blur-[100px] opacity-70 pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-rose-900/20 rounded-full blur-[100px] opacity-60 pointer-events-none" />

            <div className="relative z-10 max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center p-4 bg-slate-900 shadow-2xl shadow-indigo-500/10 rounded-full border border-slate-800 mb-2">
                        <Moon className="w-12 h-12 text-slate-300" />
                    </div>
                    <h1 className="text-5xl font-black tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent drop-shadow-sm">
                        Werwolf
                    </h1>
                    <p className="text-slate-400 text-lg mx-auto max-w-[280px]">
                        Das Dorf schläft ein. Wirst du die nächste Nacht überleben?
                    </p>
                </div>

                {/* Join Game Card */}
                <Card className="bg-slate-900/60 backdrop-blur-xl border-slate-800/60 shadow-2xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-400" /> Spiel beitreten
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Gib den 4-stelligen Game-Code ein, um ins Dorf zu gelangen.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={joinGame} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="gameId" className="text-slate-300">Game Code</Label>
                                <div className="relative">
                                    <Input
                                        id="gameId"
                                        name="gameId"
                                        placeholder="ABCD"
                                        required
                                        maxLength={4}
                                        className="uppercase bg-slate-950/50 border-slate-700 text-lg h-12 text-center tracking-widest font-mono text-white focus-visible:ring-indigo-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-300">Dein Name</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="z.B. Wolfjäger"
                                    required
                                    className="bg-slate-950/50 border-slate-700 h-12 text-lg text-white focus-visible:ring-indigo-500"
                                />
                            </div>
                            <Button type="submit" size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-lg h-12 transition-all hover:scale-[1.02] active:scale-95">
                                Beitreten
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Divider */}
                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-800/80" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase font-medium tracking-wider">
                        <span className="bg-slate-950 px-4 text-slate-500 rounded-full border border-slate-800/80">
                            Oder
                        </span>
                    </div>
                </div>

                {/* Create Game Card */}
                <Card className="bg-slate-900/40 backdrop-blur-md border-slate-800/40 opacity-90 hover:opacity-100 transition-opacity">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl flex items-center gap-2 text-slate-200">
                            <Swords className="w-5 h-5 text-emerald-400" /> Neues Spiel erstellen
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form action={createGame} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="create-name" className="text-slate-300">Dein Name (Spielleiter)</Label>
                                <Input
                                    id="create-name"
                                    name="name"
                                    placeholder="z.B. Dorfältester"
                                    required
                                    className="bg-slate-950/50 border-slate-700 h-12 text-lg text-white focus-visible:ring-emerald-500"
                                />
                            </div>
                            <Button type="submit" variant="outline" size="lg" className="w-full text-slate-300 border-slate-700 hover:bg-slate-800 h-12 transition-all hover:border-emerald-500 hover:text-emerald-400">
                                Lobby eröffnen
                            </Button>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
