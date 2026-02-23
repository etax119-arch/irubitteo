'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateNewsletter(id?: string) {
  revalidatePath('/newsletter', 'page');
  if (id) revalidatePath(`/newsletter/${id}`, 'page');
}

export async function revalidateGallery(id?: string) {
  revalidatePath('/gallery', 'page');
  if (id) revalidatePath(`/gallery/${id}`, 'page');
}
