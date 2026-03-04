"use client";

import { MegaNav } from "@/components/mega-nav/mega-nav";

interface HeaderProps {
  onSearchOpen: () => void;
}

export function Header({ onSearchOpen }: HeaderProps) {
  return <MegaNav onSearchOpen={onSearchOpen} />;
}
