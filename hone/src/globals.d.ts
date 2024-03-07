export interface User {
  id: number;
  img_id: number;
  display_name: string;
  user_name: string;
  uuid: string;
}

export interface Project {
  id: number;
  title: string | null;
  description: string | null;
  img_id: number | null;
  user_id: number;
  updated_date: Date;
}