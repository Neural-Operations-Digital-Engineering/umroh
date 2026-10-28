"use client";

import React, { useState } from "react";
import type { RoomPrice } from "@/types/package";

interface RoomPricingSelectorProps {
  roomPrices: RoomPrice[];
  phone: string;
  packageName: string;
}

export default function RoomPricingSelector({
  roomPrices,
  phone,
  packageName,
}: RoomPricingSelectorProps) {
  const defaultSelected =
    roomPrices.find((r) => r.isPopular)?.type || roomPrices[0]?.type || "";
  const [selectedRoomType, setSelectedRoomType] = useState<string>(defaultSelected);

  const cleanPhone = phone.replace(/\D/g, "").replace(/^0/, "62");

  return (
    <section aria-labelledby="pricing-heading" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-warm-border pb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-gold-hover mb-1">
            Pilihan Kamar &amp; Biaya
          </p>
          <h2 id="pricing-heading" className="font-serif text-2xl sm:text-3xl font-bold text-teal-primary">
            Rincian Biaya per Tipe Kamar
          </h2>
        </div>
        <p className="text-xs text-slate-muted font-sans">
          Klik tipe kamar untuk konsultasi kebutuhan spesifik
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {roomPrices.map((room) => {
          const isSelected = selectedRoomType === room.type;
          const waMessage = `Assalamu'alaikum Admin Risalah Madina Tour, saya tertarik dengan paket *${packageName}* untuk kamar *${room.label} (${room.price})*. Mohon info ketersediaan kuotanya.`;
          const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

          return (
            <div
              key={room.type}
              onClick={() => setSelectedRoomType(room.type)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedRoomType(room.type);
                }
              }}
              className={`rounded-card border p-5 flex flex-col justify-between transition-all cursor-pointer relative text-left ${
                isSelected
                  ? "bg-white border-teal-primary ring-2 ring-teal-primary shadow-elevated"
                  : "bg-warm-surface border-warm-border shadow-card hover:border-teal-primary/40"
              }`}
            >
              {room.isPopular && (
                <div className="absolute -top-3 right-4 bg-gold-accent text-slate-dark text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                  Paling Diminati
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "border-teal-primary bg-teal-primary"
                          : "border-slate-muted bg-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-teal-primary">
                      {room.label}
                    </h3>
                  </div>
                  <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-badge bg-teal-primary/8 text-teal-primary">
                    {room.capacity}
                  </span>
                </div>

                <p className="font-sans text-xs text-slate-body leading-relaxed mb-4">
                  {room.description}
                </p>

                <div className="p-3 rounded-button bg-warm-bg border border-warm-border mb-3">
                  <span className="text-[10px] text-slate-caption uppercase font-bold block">
                    Biaya Paket / Orang
                  </span>
                  <span className="font-sans text-xl sm:text-2xl font-bold text-teal-primary block mt-0.5">
                    {room.price}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className={`w-full min-h-10 px-3 py-2 rounded-button text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all ${
                    isSelected
                      ? "bg-teal-primary text-white shadow-xs hover:bg-teal-deep"
                      : "border border-warm-border bg-warm-surface text-slate-dark hover:border-teal-primary hover:text-teal-primary"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.12.553 4.111 1.523 5.842l-1.615 5.9 6.046-1.587c1.668.91 3.57 1.435 5.597 1.435 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>Tanya Kamar {room.label}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
