export interface BillBasicInfo {
  billTitle: string;
  billNumber: string;
  billType: string;
  proposer: string;
  proposalDate: string;
  effectiveDate: string;
  summary: string;
  keywords: string[];
  relatedLaws: string[];
  legalBasis: string;
  purpose: string;
}

export interface BillArticle {
  id: string;
  number: string;
  title: string;
  content: string;
  subArticles?: BillSubArticle[];
  order: number;
}

export interface BillSubArticle {
  id: string;
  number: string;
  content: string;
  paragraphs?: BillParagraph[];
  order: number;
}

export interface BillParagraph {
  id: string;
  number: string;
  content: string;
  items?: BillItem[];
  order: number;
}

export interface BillItem {
  id: string;
  number: string;
  content: string;
  subItems?: BillSubItem[];
  order: number;
}

export interface BillSubItem {
  id: string;
  number: string;
  content: string;
  order: number;
}

export interface BillPart {
  id: string;
  number: string;
  title: string;
  content?: string;
  chapters: BillChapter[];
  order: number;
}

export interface BillChapter {
  id: string;
  number: string;
  title: string;
  content?: string;
  articles: BillArticle[];
  order: number;
}

export interface BillSection {
  id: string;
  number: string;
  title: string;
  content?: string;
  articles: BillArticle[];
  order: number;
}

export interface BillRepealedItem {
  id: string;
  repealedLaw: string;
  repealedArticle: string;
  repealReason: string;
}

export interface BillEffectiveInfo {
  effectiveDate: string;
  signatureDate: string;
  signatory: string;
  signatoryTitle: string;
  promulgationDate: string;
  implementationDate: string;
  passageDate: string;
  legislativePresident: string;
  chiefExecutiveName: string;
}

export interface BillValidationResult {
  passed: boolean;
  errors: BillValidationError[];
  warnings: BillValidationWarning[];
}

export interface BillValidationError {
  id: string;
  message: string;
  location: string;
  severity: 'error';
}

export interface BillValidationWarning {
  id: string;
  message: string;
  location: string;
  severity: 'warning';
}

export interface BillVersion {
  id: string;
  version: string;
  author: string;
  createTime: string;
  notes: string;
  content: BillDocument;
}

export interface BillDocument {
  id: string;
  basicInfo: BillBasicInfo;
  parts?: BillPart[];
  chapters: BillChapter[];
  sections?: BillSection[];
  repealedParts: BillRepealedItem[];
  effectiveInfo: BillEffectiveInfo;
  createTime: string;
  updateTime: string;
  version: string;
  status: BillStatus;
}

export type BillStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface BillVersionHistory {
  id: string;
  version: string;
  modifiedBy: string;
  modifiedTime: string;
  description: string;
  reviewStatus?: ReviewStatus;
  content: BillDocument;
}

export interface BillVersionDifference {
  field: string;
  oldValue: string;
  newValue: string;
  changeType: 'added' | 'removed' | 'modified';
}

export type BillType = 'law' | 'regulation' | 'ordinance' | 'rule' | 'other';

export interface BillNavigationItem {
  id: string;
  type: 'basicInfo' | 'chapter' | 'article' | 'repealedParts' | 'effectiveInfo';
  title: string;
  level: number;
  children?: BillNavigationItem[];
  expanded?: boolean;
}

export interface BillEditorState {
  document: BillDocument;
  currentSection: string;
  isDirty: boolean;
  isLoading: boolean;
  validationResult?: BillValidationResult;
  versions: BillVersion[];
}

export interface BillExportOptions {
  format: 'word' | 'pdf';
  includeMetadata: boolean;
  includeVersionHistory: boolean;
  template?: string;
}

export interface BillFormattingOptions {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
}