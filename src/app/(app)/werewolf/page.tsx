'use client';

import { createGame, joinGame } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function WerewolfLobby() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-50 p-6">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight">Werwolf</h1>
                    <p className="text-slate-400 mt-2">Das Dorf schläft ein...</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                    <h2 className="text-xl font-semibold mb-4">Einem Spiel beitreten</h2>
                    <form action={joinGame} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="gameId">Game Code (4 Zeichen)</Label>
                            <Input
                                id="gameId"
                                name="gameId"
                                placeholder="ABCD"
                                required
                                maxLength={4}
                                className="uppercase bg-slate-800 border-slate-700"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Dein Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="z.B. Werwolf-Slayer99"
                                required
                                className="bg-slate-800 border-slate-700"
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Beitreten
                        </Button>
                    </form>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-slate-950 px-2 text-slate-500">Oder</span>
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                    <h2 className="text-xl font-semibold mb-4">Neues Spiel erstellen</h2>
                    <form action={createGame} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Dein Name (Game Owner)</Label>
                            <Input
                                id="create-name"
                                name="name"
                                placeholder="z.B. Dorfältester"
                                required
                                className="bg-slate-800 border-slate-700"
                            />
                        </div>
                        <Button type="submit" variant="secondary" className="w-full">
                            Erstellen
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
