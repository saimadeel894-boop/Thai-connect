"use client";

import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft, HelpCircle } from "lucide-react";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-md text-center">
        {/* Cancel Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-900">
            <XCircle className="h-12 w-12 text-gray-400" />
          </div>
        </div>

        {/* Message */}
        <h1 className="mb-2 text-3xl font-bold text-white">
          Betaling annulleret
        </h1>
        <p className="mb-8 text-lg text-gray-400">
          Din betaling blev ikke gennemført
        </p>

        {/* Info */}
        <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-start gap-3 text-left text-gray-300">
            <HelpCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-gray-500" />
            <div>
              <p className="mb-2">
                Hvis du har spørgsmål eller problemer med betalingen, er du velkommen til at kontakte os.
              </p>
              <p className="text-sm text-gray-500">
                Du kan altid prøve at opgradere igen senere.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/user")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-4 font-bold text-white transition hover:bg-red-600"
          >
            Prøv igen
          </button>
          <button
            onClick={() => router.push("/user")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-800 bg-gray-900 px-6 py-4 font-bold text-white transition hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5" />
            Tilbage til browse
          </button>
        </div>
      </div>
    </div>
  );
}
