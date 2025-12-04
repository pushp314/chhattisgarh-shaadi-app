/**
 * Photo Carousel Component
 * Swipeable image gallery for profile photos
 */

import React, { useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    Image,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

interface Photo {
    id: number;
    url: string;
    isPrivate?: boolean;
}

interface PhotoCarouselProps {
    photos: Photo[];
    onRequestPhoto?: () => void;
    showPrivateRequest?: boolean;
}

const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
    photos,
    onRequestPhoto,
    showPrivateRequest = false,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [showFullScreen, setShowFullScreen] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index || 0);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderPhoto = ({ item, index }: { item: Photo; index: number }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setShowFullScreen(true)}
            style={styles.photoContainer}
        >
            {item.isPrivate ? (
                <View style={styles.privatePlaceholder}>
                    <Icon name="lock" size={48} color="#999" />
                    <Text style={styles.privateText}>Private Photo</Text>
                    {showPrivateRequest && (
                        <TouchableOpacity style={styles.requestButton} onPress={onRequestPhoto}>
                            <Text style={styles.requestButtonText}>Request Access</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ) : (
                <Image source={{ uri: item.url }} style={styles.photo} resizeMode="cover" />
            )}
        </TouchableOpacity>
    );

    const renderDots = () => (
        <View style={styles.dotsContainer}>
            {photos.map((_, index) => (
                <View
                    key={index}
                    style={[styles.dot, activeIndex === index && styles.activeDot]}
                />
            ))}
        </View>
    );

    const renderFullScreenPhoto = ({ item }: { item: Photo }) => (
        <View style={styles.fullScreenPhotoContainer}>
            {item.isPrivate ? (
                <View style={styles.privatePlaceholder}>
                    <Icon name="lock" size={64} color="#fff" />
                    <Text style={[styles.privateText, { color: '#fff' }]}>Private Photo</Text>
                </View>
            ) : (
                <Image
                    source={{ uri: item.url }}
                    style={styles.fullScreenPhoto}
                    resizeMode="contain"
                />
            )}
        </View>
    );

    if (photos.length === 0) {
        return (
            <View style={styles.noPhotosContainer}>
                <Icon name="image-off" size={64} color="#ccc" />
                <Text style={styles.noPhotosText}>No photos available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={photos}
                renderItem={renderPhoto}
                keyExtractor={(item, index) => `photo-${item.id || index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
            {photos.length > 1 && renderDots()}

            {/* Photo count badge */}
            <View style={styles.countBadge}>
                <Icon name="image-multiple" size={14} color="#fff" />
                <Text style={styles.countText}>{activeIndex + 1}/{photos.length}</Text>
            </View>

            {/* Full Screen Modal */}
            <Modal visible={showFullScreen} transparent animationType="fade">
                <View style={styles.fullScreenContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setShowFullScreen(false)}
                    >
                        <Icon name="close" size={28} color="#fff" />
                    </TouchableOpacity>

                    <FlatList
                        data={photos}
                        renderItem={renderFullScreenPhoto}
                        keyExtractor={(item, index) => `fullscreen-${item.id || index}`}
                        horizontal
                        pagingEnabled
                        initialScrollIndex={activeIndex}
                        getItemLayout={(_, index) => ({
                            length: width,
                            offset: width * index,
                            index,
                        })}
                        showsHorizontalScrollIndicator={false}
                    />

                    <View style={styles.fullScreenDots}>
                        {photos.map((_, index) => (
                            <View
                                key={index}
                                style={[styles.dot, { backgroundColor: '#fff' }, activeIndex === index && styles.activeDot]}
                            />
                        ))}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: height * 0.5,
        position: 'relative',
    },
    photoContainer: {
        width: width,
        height: height * 0.5,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    privatePlaceholder: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    privateText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
    },
    requestButton: {
        marginTop: 16,
        backgroundColor: '#E91E63',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
    },
    requestButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    dotsContainer: {
        position: 'absolute',
        bottom: 16,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    activeDot: {
        backgroundColor: '#E91E63',
        width: 24,
    },
    countBadge: {
        position: 'absolute',
        top: 16,
        left: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    countText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    noPhotosContainer: {
        width: '100%',
        height: height * 0.4,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noPhotosText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
    },
    fullScreenContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 8,
    },
    fullScreenPhotoContainer: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreenPhoto: {
        width: width,
        height: height * 0.8,
    },
    fullScreenDots: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
});

export default PhotoCarousel;
