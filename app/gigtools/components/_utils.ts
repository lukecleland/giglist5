export const createSlug = (str: string) => {
    return str
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric characters except hyphens
      .replace(/--+/g, "-") // Replace multiple hyphens with a single hyphen
      .replace(/^-+|-+$/g, ""); // Trim hyphens from start and end
  };

  export const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });