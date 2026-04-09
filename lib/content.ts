import { aboutContent } from "@/content/about";
import { blogContent } from "@/content/blog";
import { projectsContent } from "@/content/projects";
import { trainingLogContent } from "@/content/training-log";

export function getAllProjects() {
  return projectsContent;
}

export function getProjectBySlug(slug: string) {
  return projectsContent.find((item) => item.slug === slug);
}

export function getAllArticles() {
  return blogContent;
}

export function getArticleBySlug(slug: string) {
  return blogContent.find((item) => item.slug === slug);
}

export function getAllTrainingLogs() {
  return trainingLogContent;
}

export function getTrainingLogBySlug(slug: string) {
  return trainingLogContent.find((item) => item.slug === slug);
}

export function getAboutContent() {
  return aboutContent;
}