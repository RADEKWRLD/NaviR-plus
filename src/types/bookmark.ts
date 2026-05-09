//书签schema
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  iconUrl?: string | null;
  position: number;
  createdAt: string;
}
