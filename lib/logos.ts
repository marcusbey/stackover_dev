export function getLogoUrl(websiteUrl: string): string {
  try {
    const domain = new URL(websiteUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return "/logos/placeholder.svg";
  }
}
