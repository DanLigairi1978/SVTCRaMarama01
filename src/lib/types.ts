import type { LucideIcon } from 'lucide-react';

export type NavLink = {
  href: string;
  label: string;
};

export type Project = {
  id: string;
  title: string;
  category: 'Culture' | 'Education' | 'Economy';
  summary: string;
  imageId: string;
};

export type NewsUpdate = {
  id: string;
  title: string;
  date: string;
  summary: string;
};

export type CoreProgram = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type StrategicPriority = {
  id: string;
  title: string;
  description: string;
};

export type DonorProject = {
  id: string;
  title: string;
  partner: string;
  description: string;
};

export type Partner = {
  id: string;
  name: string;
  logoId: string;
  url: string;
};
