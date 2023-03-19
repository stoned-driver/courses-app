import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {Link} from 'react-router-dom';
import {Card, CardActionArea, CardContent, CardMedia, Container, Grid, Pagination, Typography} from "@mui/material";

interface Course {
    id: number;
    title: string;
    previewImageLink: string;
    lessonsCount: number;
    meta: any;
    rating: number;
}

const useStyles = {
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardContent: {
        flexGrow: 1,
    },

    pagination: {
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'center',
    },
};

const ITEMS_PER_PAGE = 10;

const CoursesList: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [page, setPage] = useState(1);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const paginatedCourses = courses.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);


    useEffect(() => {
        async function fetchCourses() {
            const response = await api.get('/preview-courses');
            setCourses(response.data.courses);
        }

        fetchCourses();
    }, []);

    return (
        <Container>
            <Grid container spacing={4}>
            {paginatedCourses.map(course => (
                    <Grid item key={course.id} xs={12} sm={6} md={4}>
                        <Card sx={useStyles.card}>
                            <Link key={course.id} to={`/course/${course.id}`}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    image={`${course.previewImageLink}/cover.webp`} alt={course.title}
                                />
                                <CardContent sx={useStyles.cardContent}>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {course.title}
                                    </Typography>
                                    <Typography>
                                        Уроков: {course.lessonsCount} | Навыков: {course?.meta?.skills?.length} | Рейтинг: {course.rating}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            </Link>
                        </Card >
                    </Grid>
            ))}
        </Grid>
            <Pagination
                sx={useStyles.pagination}
                count={Math.ceil(courses.length / ITEMS_PER_PAGE)}
                page={page}
                onChange={handlePageChange}
                color="primary"
            />
        </Container>
    );
};

export default CoursesList;
