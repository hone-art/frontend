export interface User {
  id: number;
  img_id: number;
  display_name: string;
  user_name: string;
  uuid: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  img_id: number;
  user_id: number;
  updated_date: Date;
}

export interface Image {
  id: number;
  url: string;
}

export interface Entry {
  id: number;
  description: string;
  img_id: number | null;
  project_id: number;
  user_id: number;
  created_date: Date;
}