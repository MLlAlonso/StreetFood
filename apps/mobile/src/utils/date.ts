export function formatRelativeDate(date: string) {
    const now = new Date();
    const created = new Date(date);

    const diff = Math.floor(
        (now.getTime() - created.getTime()) / 1000
    );

    if (diff < 60) {
        return "Just now";
    }

    if (diff < 3600) {
        const minutes = Math.floor(diff / 60);
        return `${minutes} min`;
    }

    if (diff < 86400) {
        const hours = Math.floor(diff / 3600);
        return `${hours} h`;
    }

    if (diff < 604800) {
        const days = Math.floor(diff / 86400);
        return `${days} d`;
    }

    return created.toLocaleDateString();
}