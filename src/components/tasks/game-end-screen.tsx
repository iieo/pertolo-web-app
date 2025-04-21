import { useGame } from "@/app/(app)/game/[id]/game-provider";
import { redirect } from "next/navigation";

function GameEndScreen() {
    const { game } = useGame();
    return (
        <div
            className={`flex flex-col items-center justify-center min-h-screen w-full p-4 text-center bg-gradient-to-br  from-pink-900 via-fuchsia-900 to-indigo-900`}
            onClick={() => redirect(`/game/${game.gameCode}/mode`)}
        >
            <h2 className="text-5xl font-extrabold tracking-tight text-purple-300 drop-shadow-lg mb-2">
                Das Spiel ist vorbei!
            </h2>
            <p className="mt-4 text-xl text-purple-100/80 font-medium">
                Danke fürs Mitmachen!
            </p>
        </div>
    );
}

export default GameEndScreen;
