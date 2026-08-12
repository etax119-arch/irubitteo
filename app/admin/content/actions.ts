'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateNewsletter(id?: string) {
  revalidatePath('/newsletter', 'page');
  if (id) revalidatePath(`/newsletter/${id}`, 'page');
}

export async function revalidateStory(id?: string) {
  revalidatePath('/story', 'page');
  if (id) revalidatePath(`/story/${id}`, 'page');
}

export async function revalidateGallery(id?: string) {
  revalidatePath('/gallery', 'page');
  if (id) revalidatePath(`/gallery/${id}`, 'page');
}

export async function revalidateAnnouncement(id?: string) {
  revalidatePath('/', 'page');
  revalidatePath('/announcements', 'page');
  if (id) revalidatePath(`/announcements/${id}`, 'page');
}
