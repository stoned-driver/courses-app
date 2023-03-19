export const loadProgress = (courseId: number, lessonId: number): number | null => {
    const progress = localStorage.getItem(`course-${courseId}-lesson-${lessonId}`);
    return progress ? parseFloat(progress) : null;
};

export const saveProgress = (
    courseId: number,
    lessonId: number,
    progress: number,
): void => {
    localStorage.setItem(`course-${courseId}-lesson-${lessonId}`, progress.toString());
};
