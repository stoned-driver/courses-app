import React, {useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import HlsPlayer from 'react-hls-player';
import {loadProgress, saveProgress} from "../utils/progress";
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CircularProgress,
    Grid,
    Typography
} from "@mui/material";
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';

enum STATUS {
    UNLOCKED = 'unlocked',
    LOCKED = 'locked'
}

interface Course {
    id: number;
    title: string;
    lessons: Lesson[];
}

interface Lesson {
    id: number;
    title: string;
    order: number;
    link: string;
    previewImageLink: string;
    status: STATUS
}

const CourseDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);


    useEffect(() => {
        async function fetchCourseDetails() {
            const response = await api.get(`/preview-courses/${id}`);
            setCourse(response.data);
            setActiveLesson(response.data.lessons[0]);
        }

        fetchCourseDetails();
    }, [id]);

    useEffect(() => {
        if (activeLesson) {
            const progress = loadProgress(parseInt(id as string), activeLesson.id);
            if (progress && videoRef.current) {
                videoRef.current.currentTime = progress;
            }
        }
    }, [activeLesson, id]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!videoRef.current) return;

            switch (e.key) {
                case 'ArrowUp':
                    videoRef.current.playbackRate += 0.1;
                    break;
                case 'ArrowDown':
                    videoRef.current.playbackRate -= 0.1;
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleTimeUpdate = () => {
        if (videoRef.current && activeLesson) {
            saveProgress(parseInt(id as string), activeLesson.id, videoRef.current.currentTime);
        }
    };

    const handlePIP = () => {
        if (videoRef.current && document.pictureInPictureEnabled) {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture();
            } else {
                videoRef.current.requestPictureInPicture();
            }
        }
    };

    const selectLesson = (lesson: Lesson) => {
        if (lesson.status === STATUS.UNLOCKED) {
            setActiveLesson(lesson);
        }
    };

    if (!course || !activeLesson) {
        return <CircularProgress style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        }} size={80} />
    }



    return (
        <Box style={{ position: 'relative'}}>
            <Typography variant="h2">{course.title}</Typography>
            <HlsPlayer
                playerRef={videoRef}
                src={activeLesson.link}
                autoPlay={false}
                controls={true}
                width="100%"
                height="auto"
                onTimeUpdate={handleTimeUpdate}
               />
            <Button variant="contained" onClick={handlePIP} endIcon={<PictureInPictureAltIcon/>}>Watch </Button>

            <Grid container spacing={2}>
                {course.lessons.map(lesson => (

                    <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                        <Card onClick={() => selectLesson(lesson)} sx={{ opacity: lesson.status === STATUS.LOCKED ? 0.5 : 1 }}
                              style={{
                                  position: 'relative'
                              }}
                        >
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={`${lesson.previewImageLink}/lesson-${lesson.order}.webp`}
                                    alt={lesson.title}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {lesson.title}
                                    </Typography>
                                    {lesson.status === STATUS.LOCKED && (
                                        <Typography variant="body2" color="text.secondary" style={{
                                            color: 'yellowgreen',
                                            fontSize: '2rem',
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)'
                                        }}>
                                            Locked 😞
                                        </Typography>
                                    )}
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>

                ))}
            </Grid>
            </Box>
  );
};

export default CourseDetails
