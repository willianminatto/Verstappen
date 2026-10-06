import { helmets } from "./helmets";

/**
 * Image credits — the single source for the public `/credits` page.
 * `IMAGE_CREDITS.md` mirrors this file; update both together.
 *
 * Every entry describes a file the site uses today. For the photographs, the
 * "source" is the page where the picture was verified to appear; that is not
 * the same thing as its author, its rights holder or a license, and those
 * stay marked as pending until they are actually confirmed. Nothing here is
 * guessed.
 */
export type ImageCredit = {
  /** Path under /public of the file in use. */
  src: string;
  title: string;
  /** Where the image appears on the site. */
  usage: string;
  author: string;
  source: string;
  /** Page of the original file, or the page where the image was found. */
  sourceUrl?: string;
  /** What `sourceUrl` points to; shown as the link text. */
  sourceUrlLabel?: string;
  license: string;
  licenseUrl?: string;
  /** How the image is altered when displayed. */
  changes: string;
  notes?: string;
  /** True while the license (and possibly more) is unconfirmed. */
  pending: boolean;
};

const LICENSE_PENDING = "license pending confirmation";

const photoChanges =
  "The stored file is not edited. On the site it is cropped with CSS (object-fit: cover with focal positioning) and shown with a colour treatment applied in CSS: slightly lower saturation, added contrast, a navy cast, a soft vignette and grain, plus section overlays and parallax. No watermark or attribution was removed. Next.js serves resized, compressed variants. None of this changes who owns the image.";

type Photograph = Pick<ImageCredit, "src" | "title" | "usage" | "author" | "source" | "notes"> & {
  sourceUrl?: string;
};

const photographs: Photograph[] = [
  {
    src: "/images/hero/max-hero.jpg",
    title: "Hero — Max Verstappen",
    usage: "Hero: full-screen opening image.",
    author: "author pending confirmation",
    source:
      "Found on SpeedRacing (speedracing.com.br), article “Fórmula-1: Max Verstappen vence o GP do Azerbaijão”, published 21 September 2025.",
    sourceUrl:
      "https://www.speedracing.com.br/formula-1-max-verstappen-vence-o-gp-do-azerbaijao-2/",
    notes:
      "The local file is byte-identical to the 1440 × 1800 JPEG published on that page. The page shows no photographer or agency credit, so it is recorded as the place the image was found, not as its origin.",
  },
  {
    src: "/images/driver/max-driver.jpg",
    title: "The Driver — portrait",
    usage: "The Driver: portrait beside the driver facts.",
    author:
      "Photographer pending confirmation. Credit line shown with the image on the source page: © Getty Images / Red Bull Content Pool.",
    source:
      "Red Bull (redbull.com), article “Max Verstappen dá boa noite em Vegas (com sorriso do tetra)”.",
    sourceUrl: "https://www.redbull.com/br-pt/motor-f1-max-verstappen-tetracampeao",
    notes:
      "The local file is a 400 × 500 crop of the article’s lead image. It is stored with a .jpg name but its contents are AVIF.",
  },
  {
    src: "/images/on-track/on-track-intro.jpg",
    title: "On Track — opening visual",
    usage: "Drives That Defined: opening frame of the section (not one of the race cards).",
    author: "author pending confirmation",
    source:
      "Found on Motorsport.com Brasil (motorsport.uol.com.br), article “F1: Verstappen não entende por que continua batendo tanto com Hamilton”, published 3 January 2023.",
    sourceUrl:
      "https://motorsport.uol.com.br/f1/news/f1-verstappen-nao-entende-por-que-continua-batendo-tanto-com-hamilton/10416753/",
    notes:
      "Same picture as the article’s lead image, described there as “Max Verstappen, Red Bull Racing RB18, collides with Lewis Hamilton, Mercedes W13”. No photographer credit is shown for this image on the page. The local file is 1000 × 667, stored with a .jpg name but with WebP contents.",
  },
  {
    src: "/images/on-track/barcelona2016.jpg",
    title: "On Track — Barcelona 2016",
    usage: "Drives That Defined: Spanish Grand Prix 2016 card.",
    author:
      "Photographer pending confirmation. Credit line shown with the image on the source page: © DPPI.",
    source:
      "AUTOhebdo (autohebdof1.com), article “2016 Spanish GP – The day Max Verstappen opened his Formula 1 account”.",
    sourceUrl:
      "https://www.autohebdof1.com/news/f1/Spanish-GP-2016%3A-the-day-Max-Verstappen-opened-his-Formula-1-account.html",
    notes:
      "Same picture as the article’s lead image (published there at 1200 × 799); the local file is 678 × 452.",
  },
  {
    src: "/images/on-track/zandvoort2021.jpg",
    title: "On Track — Zandvoort 2021",
    usage: "Drives That Defined: Dutch Grand Prix 2021 card.",
    author: "author pending confirmation",
    source: "Pirelli press release “2021 Dutch Grand Prix – Saturday” (press.pirelli.com).",
    sourceUrl: "https://press.pirelli.com/2021-dutch-grand-prix--saturday/",
    notes:
      "Same picture as the featured image of the press release (published there at 1800 × 721); the local file is 708 × 282. The page names no photographer and its terms of use for the image have not been confirmed.",
  },
  {
    src: "/images/on-track/spa-francorchamps-2022.jpg",
    title: "On Track — Spa-Francorchamps 2022",
    usage: "Drives That Defined: Belgian Grand Prix 2022 card.",
    author: "author pending confirmation",
    source: "source pending confirmation",
    notes:
      "1200 × 800 JPEG supplied locally; it has been in this slot since 5 October 2026. The image carries no visible credit or watermark, and no page of origin has been identified for it. Source, author and license all remain to be confirmed.",
  },
  {
    src: "/images/on-track/interlagos2024.jpg",
    title: "On Track — Interlagos 2024",
    usage: "Drives That Defined: São Paulo Grand Prix 2024 card.",
    author:
      "Photographer pending confirmation. Credit line shown with the image on the source page: Foto: Getty Images.",
    source:
      "ge (ge.globo.com), article “Verstappen elege vitória no GP de São Paulo como a melhor da carreira”, published 4 November 2024.",
    sourceUrl:
      "https://ge.globo.com/motor/formula-1/noticia/2024/11/04/verstappen-elege-vitoria-no-gp-de-sao-paulo-como-a-melhor-da-carreira.ghtml",
    notes:
      "Same picture as the fourth image of the article, captioned there “Max Verstappen vence GP de São Paulo 2024 da F1”; the local file is 678 × 452.",
  },
  {
    src: "/images/beyond/max-sim-racing.jpg",
    title: "Beyond Formula 1 — sim racing",
    usage: "Beyond Formula 1: main visual of the section.",
    author: "author pending confirmation",
    source: "Found on BoxThisLap (boxthislap.org), article “Max Verstappen – Sim Racing Setup”.",
    sourceUrl: "https://boxthislap.org/max-verstappen-sim-racing-setup/",
    notes:
      "The local file is byte-identical to the 768 × 768 image published on that page. It is stored with a .jpg name but its contents are WebP. The page shows no photographer credit, so it is recorded as the place the image was found, not as its origin.",
  },
];

export const imageCredits: ImageCredit[] = [
  ...photographs.map((photo) => ({
    ...photo,
    sourceUrlLabel: photo.sourceUrl ? "Source page" : undefined,
    license: LICENSE_PENDING,
    changes: photoChanges,
    pending: true,
  })),
  ...helmets.map((helmet) => ({
    src: helmet.src,
    title: `Championship helmet — ${helmet.name}`,
    usage: `Championship Helmets: ${helmet.name} card.`,
    author: "Auge=mit",
    source: "Wikimedia Commons",
    sourceUrl: helmet.sourceUrl,
    sourceUrlLabel: "Original file",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    changes:
      "Original 2500 × 2300 file preserved intact. No crop, retouching or background removal. CSS contain, padding and multiply blend over a neutral backdrop; container tilt and shadow. Next.js generates resized/compressed delivery variants, which retain CC BY-SA 4.0.",
    pending: false,
  })),
];
