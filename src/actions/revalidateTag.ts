"use server";

import { revalidatePath } from "next/cache";

function customRevalidatePath(path: string) {
  revalidatePath(path);
}

export default customRevalidatePath;
