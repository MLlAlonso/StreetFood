import { View, FlatList, ActivityIndicator, } from "react-native";

import { Review } from "../types/Review";
import { useEffect, useState, } from "react";
import { useLocalSearchParams, } from "expo-router";
import AppHeader from "@/components/layout/AppHeader";
import ReviewCard from "@/components/cards/ReviewCard";
import { getBusinessReviews, } from "../services/businessProfile.service";

export default function ReviewsScreen() {
    const { id } = useLocalSearchParams();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [page, setPage,] = useState(1);
    const [loading, setLoading,] = useState(true);
    const [loadingMore, setLoadingMore,] = useState(false);
    const [lastPage, setLastPage,] = useState(1);

    useEffect(() => { loadReviews(); }, []);

    const loadReviews = async () => {
        const response = await getBusinessReviews(Number(id), 1);
        setReviews( response.data.data );
        setLastPage( response.data.last_page );
        setLastPage(response.meta.last_page);
        setLoading(false);
    };

    const loadMore = async () => {
        if (loadingMore || page >= lastPage) {
            return;
        }

        setLoadingMore(true);
        const next = page + 1;
        const response = await getBusinessReviews(Number(id), next);
        setReviews(prev => [...prev, ...response.data,]);
        setPage(next);
        setLoadingMore(false);
    };

    if (loading) {
        return (
            <ActivityIndicator />
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <AppHeader />

            <FlatList
                contentContainerStyle={{ padding: 20, }}
                data={reviews}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <ReviewCard
                        name={item.user.name}
                        avatar={item.user.avatar}
                        comment={item.comment}
                        rating={item.rating}
                        createdAt={item.created_at}
                    />
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.4}
                ListFooterComponent={loadingMore ? <ActivityIndicator /> : null}
            />
        </View>
    );
}