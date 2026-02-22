'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateNewsletter() {
  revalidatePath('/newsletter', 'page');
}

export async function revalidateGallery() {
  revalidatePath('/gallery', 'page');
}
