import { View, FlatList, ActivityIndicator, TouchableOpacity, Text, Image, } from "react-native";

import { Review } from "../types/Review";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter, } from "expo-router";
import { getBusinessReviews } from "../services/businessProfile.service";
import AppHeader from "@/components/layout/AppHeader";
import ReviewCard from "@/components/cards/ReviewCard";

export default function ReviewsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const backIcon = require("@/assets/icons/arrow-left.png");

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            const response = await getBusinessReviews(Number(id), 1);
            setReviews(response.data.data);
            setLastPage(response.data.last_page);
            setPage(response.data.current_page);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = async () => {
        if (loadingMore || page >= lastPage) {
            return;
        }
        try {
            setLoadingMore(true);
            const nextPage = page + 1;
            const response = await getBusinessReviews(Number(id), nextPage);

            setReviews(previous => [
                ...previous,
                ...response.data.data,
            ]);

            setPage(response.data.current_page);
            setLastPage(response.data.last_page);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingMore(false);
        }
    };

    if (loading) {
        return <ActivityIndicator />;
    }

    return (
        <View style={{ flex: 1 }}>
            <AppHeader />

            <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 20, paddingVertical: 16, }} >
                <Image source={backIcon} style={{ width: 24, height: 24, }} />
            </TouchableOpacity>

            <FlatList
                contentContainerStyle={{ padding: 15, }}
                data={reviews}
                keyExtractor={(item) => item.id.toString() }
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
                ListFooterComponent={
                    loadingMore
                        ? <ActivityIndicator />
                        : null
                }
            />

        </View>
    );
}