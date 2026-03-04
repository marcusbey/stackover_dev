"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "./nav-data";

interface MobileNavProps {
  onSearchOpen: () => void;
}

export function MobileNav({ onSearchOpen }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const toggleSection = (key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  const handleClose = () => {
    setIsOpen(false);
    setExpandedKey(null);
  };

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l bg-background shadow-xl">
            <div className="flex h-14 items-center justify-between border-b px-4">
              <span className="text-sm font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="overflow-y-auto px-4 py-4" style={{ maxHeight: "calc(100dvh - 3.5rem)" }}>
              {/* Search shortcut */}
              <button
                className="mb-4 flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent"
                onClick={() => {
                  handleClose();
                  onSearchOpen();
                }}
              >
                <Search className="h-4 w-4" />
                Search tools...
              </button>

              {/* Nav sections */}
              <div className="space-y-1">
                {NAV_ITEMS.map((item) =>
                  item.href ? (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="block rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                      onClick={handleClose}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <div key={item.key}>
                      <button
                        className="flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                        onClick={() => toggleSection(item.key)}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            expandedKey === item.key ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {expandedKey === item.key && item.columns && (
                        <div className="ml-3 space-y-3 border-l py-2 pl-3">
                          {item.columns.map((col, i) => (
                            <div key={i}>
                              {col.title && (
                                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                  {col.title}
                                </p>
                              )}
                              <div className="space-y-0.5">
                                {col.links.map((link) => (
                                  <Link
                                    key={link.label}
                                    href={link.href}
                                    className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                    onClick={handleClose}
                                  >
                                    {link.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>

              {/* Sign in */}
              <div className="mt-6 border-t pt-4">
                <Link href="/auth/sign-in" onClick={handleClose}>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
