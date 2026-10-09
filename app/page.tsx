"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Clipboard,
  Crosshair,
  Info,
  Sparkles,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SwingPoint = "low" | "high";

const DEGREES = Array.from({ length: 16 }, (_, index) => (index + 1) * 45);
const PRICE_PATTERN = /^(?:\d+\.?\d*|\.\d+)$/;
const numberFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatSigned(value: number) {
  const roundedValue = Math.abs(value) < 0.005 ? 0 : value;
  return `${roundedValue > 0 ? "+" : ""}${roundedValue.toFixed(2)}`;
}

export default function Home() {
  const [priceInput, setPriceInput] = useState("24587");
  const [swingPoint, setSwingPoint] = useState<SwingPoint>("low");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const trimmedPrice = priceInput.trim();
  const price = Number(trimmedPrice);
  const isValidPrice =
    PRICE_PATTERN.test(trimmedPrice) && Number.isFinite(price) && price > 0;
  const levels = useMemo(() => {
    if (!isValidPrice) return [];

    return DEGREES.map((degree) => {
      const root = Math.sqrt(price);
      const offset = degree / 180;
      const level =
        swingPoint === "low" ? (root + offset) ** 2 : (root - offset) ** 2;
      const difference = level - price;

      return {
        degree,
        level,
        difference,
        percentage: (difference / price) * 100,
      };
    });
  }, [isValidPrice, price, swingPoint]);

  async function copyAllLevels() {
    if (!isValidPrice) return;

    const content = [
      `Gann Square of 9 — ${swingPoint === "low" ? "Swing Low" : "Swing High"}`,
      `Input price: ${price.toFixed(2)}`,
      "",
      "Degree\tCalculated Price Level\tDifference\tPercentage Difference",
      ...levels.map(
        ({ degree, level, difference, percentage }) =>
          `${degree}°\t${level.toFixed(2)}\t${formatSigned(difference)}\t${formatSigned(percentage)}%`,
      ),
    ].join("\n");

    try {
      await navigator.clipboard.writeText(content);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }
  }

  const isResistance = swingPoint === "low";

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div aria-hidden="true" className="page-glow pointer-events-none absolute inset-x-0 top-0 -z-10 h-[440px]" />
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-5 sm:px-6 sm:pt-8 lg:px-8">
        <header className="flex items-center justify-between">
          <a
            aria-label="Gann Levels home"
            className="flex items-center gap-3"
            href="/"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Crosshair aria-hidden="true" className="size-5" />
            </span>
            <span className="font-display text-[17px] font-semibold tracking-tight">
              Gann<span className="text-primary">Levels</span>
            </span>
          </a>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
              Theme
            </span>
            <ThemeToggle />
          </div>
        </header>

        <section className="mx-auto mt-12 max-w-3xl text-center sm:mt-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <Sparkles aria-hidden="true" className="size-3.5 text-primary" />
            A clear view of your key price levels
          </div>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[42px]">
            Gann Square of 9
            <span className="mt-1 block text-muted-foreground">
              Level Calculator
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            Find potential support and resistance levels from a swing point.
            Enter a price to calculate all 16 angles instantly.
          </p>
        </section>

        <Card className="mx-auto mt-9 max-w-4xl overflow-hidden border-border/80 shadow-lg shadow-black/[0.025] sm:mt-11">
          <CardHeader className="border-b bg-muted/25 px-5 py-5 sm:px-7 sm:py-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="w-full sm:max-w-[280px]">
                <label
                  className="mb-2 block text-sm font-medium"
                  htmlFor="price"
                >
                  Stock or index price
                </label>
                <Input
                  aria-describedby={isValidPrice ? undefined : "price-error"}
                  aria-invalid={!isValidPrice}
                  autoComplete="off"
                  id="price"
                  inputMode="decimal"
                  onChange={(event) => {
                    setPriceInput(event.target.value);
                    setCopyState("idle");
                  }}
                  placeholder="e.g. 24587"
                  value={priceInput}
                />
                {!isValidPrice && (
                  <p
                    className="mt-2 text-xs font-medium text-destructive"
                    id="price-error"
                    role="alert"
                  >
                    Enter a valid price greater than zero.
                  </p>
                )}
              </div>

              <div className="w-full sm:w-auto">
                <span className="mb-2 block text-sm font-medium">
                  Swing point
                </span>
                <div
                  aria-label="Select swing point"
                  className="grid grid-cols-2 rounded-lg border bg-background p-1 sm:inline-flex"
                  role="group"
                >
                  <Button
                    aria-pressed={swingPoint === "low"}
                    className="min-w-[116px]"
                    onClick={() => {
                      setSwingPoint("low");
                      setCopyState("idle");
                    }}
                    variant={swingPoint === "low" ? "default" : "ghost"}
                  >
                    Swing Low
                  </Button>
                  <Button
                    aria-pressed={swingPoint === "high"}
                    className="min-w-[116px]"
                    onClick={() => {
                      setSwingPoint("high");
                      setCopyState("idle");
                    }}
                    variant={swingPoint === "high" ? "default" : "ghost"}
                  >
                    Swing High
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  {isResistance
                    ? "Swing low · Resistance levels"
                    : "Swing high · Support levels"}
                </p>
                <p className="mt-1 font-display text-3xl font-semibold tracking-tight tabular-nums sm:text-[34px]">
                  {isValidPrice ? numberFormat.format(price) : "—"}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    input price
                  </span>
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <Button
                  className="w-full sm:w-auto"
                  disabled={!isValidPrice}
                  onClick={copyAllLevels}
                  variant="outline"
                >
                  {copyState === "copied" ? (
                    <Check aria-hidden="true" className="size-4" />
                  ) : (
                    <Clipboard aria-hidden="true" className="size-4" />
                  )}
                  {copyState === "copied" ? "Copied" : "Copy all levels"}
                </Button>
                <span
                  aria-live="polite"
                  className={`min-h-4 text-xs ${copyState === "error" ? "text-destructive" : "text-muted-foreground"}`}
                  role="status"
                >
                  {copyState === "error"
                    ? "Could not copy. Check clipboard permissions."
                    : copyState === "copied"
                      ? "All levels copied to clipboard."
                      : ""}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto border-t">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3.5 sm:px-7" scope="col">
                      Degree
                    </th>
                    <th className="px-4 py-3.5 text-right" scope="col">
                      Calculated price level
                    </th>
                    <th className="px-4 py-3.5 text-right" scope="col">
                      Difference
                    </th>
                    <th className="px-5 py-3.5 text-right sm:px-7" scope="col">
                      Percentage difference
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {levels.map(({ degree, level, difference, percentage }) => (
                    <tr
                      className="transition-colors hover:bg-muted/30"
                      key={degree}
                    >
                      <th
                        className="px-5 py-3.5 font-medium tabular-nums sm:px-7"
                        scope="row"
                      >
                        {degree}°
                      </th>
                      <td className="px-4 py-3.5 text-right font-semibold tabular-nums">
                        {numberFormat.format(level)}
                      </td>
                      <td
                        className={`px-4 py-3.5 text-right tabular-nums ${difference > 0 ? "text-positive" : difference < 0 ? "text-negative" : "text-muted-foreground"}`}
                      >
                        <span className="inline-flex items-center justify-end gap-1">
                          {difference > 0 ? (
                            <ArrowUpRight
                              aria-hidden="true"
                              className="size-3.5"
                            />
                          ) : difference < 0 ? (
                            <ArrowDownRight
                              aria-hidden="true"
                              className="size-3.5"
                            />
                          ) : null}
                          {formatSigned(difference)}
                        </span>
                      </td>
                      <td
                        className={`px-5 py-3.5 text-right tabular-nums sm:px-7 ${percentage > 0 ? "text-positive" : percentage < 0 ? "text-negative" : "text-muted-foreground"}`}
                      >
                        {formatSigned(percentage)}%
                      </td>
                    </tr>
                  ))}
                  {!isValidPrice && (
                    <tr>
                      <td
                        className="px-5 py-10 text-center text-sm text-muted-foreground sm:px-7"
                        colSpan={4}
                      >
                        Enter a valid price to see your calculated levels.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-start gap-2.5 border-t bg-muted/20 px-5 py-4 text-xs leading-5 text-muted-foreground sm:px-7">
              <Info
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-primary"
              />
              <p>
                {isResistance ? (
                  <>
                    Resistance = (√price + degree ÷ 180)<sup>2</sup>
                  </>
                ) : (
                  <>
                    Support = (√price − degree ÷ 180)<sup>2</sup>
                  </>
                )}
                . Levels are mathematical reference points, not a prediction
                or investment advice.
              </p>
            </div>
          </CardContent>
        </Card>

        <footer className="mt-7 text-center text-xs text-muted-foreground">
          Calculations run in your browser. No data is stored or sent anywhere.
        </footer>
      </div>
    </main>
  );
}
