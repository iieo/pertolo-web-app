'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Props = {
    code: string;
};

export default function GameCodeCopy({ code }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="lg"
                        className="font-mono bg-purple-950/80 px-2 py-1 rounded text-purple-200 tracking-widest hover:bg-purple-700/80 hover:text-white  transition cursor-pointer text-xl  hover:scale-105"
                        onClick={handleCopy}
                        type="button"
                    >
                        {code}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                    {copied ? 'Copied!' : 'Copy to clipboard'}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
