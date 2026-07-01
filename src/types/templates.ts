export type BackgroundFillType = 'color' | 'image';
export type BackgroundImageFit = 'cover' | 'contain' | 'stretch';

export type BackgroundPositionUnit = '%' | 'px';

export interface BackgroundImagePosition {
  x: number;
  xUnit: BackgroundPositionUnit;
  y: number;
  yUnit: BackgroundPositionUnit;
}

export interface BackgroundImageSize {
  width: number;
  widthUnit: BackgroundPositionUnit;
  /** `auto` = hauteur proportionnelle (syntaxe CSS à une valeur). */
  height: number | 'auto';
  heightUnit: BackgroundPositionUnit;
}

/** Anciennes valeurs prédéfinies (migration lecture seule). */
export type LegacyBackgroundImagePosition =
  | 'top left'
  | 'top center'
  | 'top right'
  | 'center left'
  | 'center'
  | 'center right'
  | 'bottom left'
  | 'bottom center'
  | 'bottom right';

export type DocTemplateType =
  | 'cartel'
  | 'fiche'
  | 'catalogue_page'
  | 'portfolio'
  | 'certificat'
  | 'presse'
  | 'custom';

export type PageFormat = 'a4' | 'a6' | 'a5';

export type FieldKey =
  | 'work.image'
  | 'work.titre'
  | 'work.annee'
  | 'work.technique'
  | 'work.dimensions'
  | 'work.prix'
  | 'work.ref'
  | 'work.description'
  | 'work.statut'
  | 'artist.nom'
  | 'artist.bio_fr'
  | 'artist.photo'
  | 'artist.email'
  | 'artist.site'
  | 'expo.titre'
  | 'expo.lieu'
  | 'expo.dates'
  | 'expo.texte_curatorial';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type AlignItems = 'flex-start' | 'center' | 'flex-end' | 'stretch';
export type JustifyContent =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';
export type SelfAlign = 'flex-start' | 'center' | 'flex-end';
export type TextAlign = 'left' | 'center' | 'right';
export type FontFamily = 'serif' | 'sans' | 'mono';

export interface ImageDropShadow {
  enabled?: boolean;
  offsetX?: number;
  offsetY?: number;
  blur?: number;
  color?: string;
  /** Opacité de l'ombre, 0–100 */
  opacity?: number;
}

/** Rôle sémantique d'un conteneur (le conteneur racine de page = zone « corps » du modèle). */
export type ContainerRole = 'page-content';

export interface DocBlock {
  id: string;
  type: 'container' | 'field' | 'text' | 'spacer' | 'image' | 'rectangle';
  /** Conteneur racine de page — libellé « Contenu de page » dans l'éditeur. */
  containerRole?: ContainerRole;
  direction?: FlexDirection;
  gap?: number;
  align?: AlignItems;
  justify?: JustifyContent;
  padding?: number;
  blockPadding?: number;
  blockMarginTop?: number;
  blockMarginRight?: number;
  blockMarginBottom?: number;
  blockMarginLeft?: number;
  flex?: number;
  width?: string;
  height?: string;
  selfAlign?: SelfAlign;
  children?: DocBlock[];
  field?: FieldKey;
  content?: string;
  fontSize?: number;
  fontFamily?: FontFamily;
  fontWeight?: 'normal' | 'bold';
  textAlign?: TextAlign;
  color?: string;
  writingMode?: 'horizontal-tb' | 'vertical-rl' | 'vertical-lr';
  textTransform?: 'none' | 'uppercase';
  imageHeight?: string | number;
  imageWidth?: string | number;
  imageSrc?: string;
  objectFit?: 'cover' | 'contain';
  /** Ombre portée (drop-shadow) autour de l'image */
  imageShadow?: ImageDropShadow;
  spacerHeight?: number;
  rectHeight?: number;
  backgroundColor?: string;
  backgroundType?: BackgroundFillType;
  backgroundImage?: string;
  backgroundImageFit?: BackgroundImageFit;
  backgroundImageSize?: BackgroundImageSize;
  backgroundImagePosition?: BackgroundImagePosition;
  borderColor?: string;
  borderWidth?: number;
}

export type PageKind = 'static' | 'dynamic';

export interface DocTemplatePage {
  id: string;
  kind: PageKind;
  root: DocBlock;
  /** Fond couleur de la page (marges comprises). */
  background?: string;
  backgroundType?: BackgroundFillType;
  backgroundImage?: string;
  backgroundImageFit?: BackgroundImageFit;
  backgroundImageSize?: BackgroundImageSize;
  backgroundImagePosition?: BackgroundImagePosition;
}

export interface DocTemplate {
  id: string;
  nom: string;
  type: DocTemplateType;
  format: PageFormat;
  margin: number;
  background: string;
  /** @deprecated Conservé pour compatibilité — utiliser `pages[0].root`. */
  root: DocBlock;
  /** Pages du modèle (simple = 1×, dynamique = répétée par œuvre sélectionnée). */
  pages?: DocTemplatePage[];
  createdAt: string;
  updatedAt: string;
}

export const PAGE_FORMATS: { value: PageFormat; label: string; w: number; h: number }[] = [
  { value: 'a4', label: 'A4', w: 210, h: 297 },
  { value: 'a5', label: 'A5', w: 148, h: 210 },
  { value: 'a6', label: 'A6 (cartel)', w: 105, h: 148 },
];

export const TEMPLATE_TYPES: { value: DocTemplateType; label: string }[] = [
  { value: 'cartel', label: 'Cartel' },
  { value: 'fiche', label: 'Fiche œuvre' },
  { value: 'catalogue_page', label: 'Catalogue' },
  { value: 'certificat', label: 'Certificat' },
  { value: 'presse', label: 'Dossier presse' },
  { value: 'custom', label: 'Personnalisé' },
];
