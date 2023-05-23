/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Image, ImageLoadEventData, ImageProps } from 'expo-image';
import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { ImageSource, Dimensions } from '../../@types';
import useDoubleTapToZoom from '../../hooks/useDoubleTapToZoom';
import { getImageStyles, getImageTransform } from '../../utils';
import { ImageLoading } from './ImageLoading';

const SWIPE_CLOSE_OFFSET = 75;
const SWIPE_CLOSE_VELOCITY = 1.55;

type Props = {
  imageSrc: ImageSource;
  onRequestClose: () => void;
  onZoom: (scaled: boolean) => void;
  onLongPress: (image: ImageSource) => void;
  delayLongPress: number;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
  onPress: (image: ImageSource) => void;
  doubleTapDelay: number;
  imageProps?: ImageProps;
  layout: Dimensions;
};

const AnimatedImage = Animated.createAnimatedComponent(Image);

const ImageItem = ({
  imageSrc,
  onZoom,
  onRequestClose,
  onLongPress,
  delayLongPress,
  swipeToCloseEnabled = true,
  doubleTapToZoomEnabled = true,
  onPress,
  doubleTapDelay,
  imageProps,
  layout,
}: Props) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [size, setSize] = useState({
    width: layout.width,
    height: layout.height,
  });
  const [loaded, setLoaded] = useState(false);
  const [scaled, setScaled] = useState(false);
  const handleDoubleTap = useDoubleTapToZoom({
    scrollViewRef,
    scaled,
    screen: layout,
    onPress: () => onPress(imageSrc),
    doubleTapToZoomEnabled,
    doubleTapDelay,
  });

  const [translate, scale] = getImageTransform(size, layout);
  const scrollValueY = new Animated.Value(0);
  const scaleValue = new Animated.Value(scale || 1);
  const translateValue = new Animated.ValueXY(translate);
  const maxScale = scale && scale > 0 ? Math.max(1 / scale, 1) : 1;

  const imageOpacity = scrollValueY.interpolate({
    inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
    outputRange: [0.5, 1, 0.5],
  });
  const imagesStyles = getImageStyles(size, translateValue, scaleValue);
  const imageStylesWithOpacity = { ...imagesStyles, opacity: imageOpacity };

  const onScrollEndDrag = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
      const velocityY = nativeEvent?.velocity?.y ?? 0;
      const scaled = nativeEvent?.zoomScale > 1;

      onZoom(scaled);
      setScaled(scaled);

      if (
        !scaled &&
        swipeToCloseEnabled &&
        Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY
      ) {
        onRequestClose();
      }
    },
    [scaled]
  );

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent?.contentOffset?.y ?? 0;

    if (nativeEvent?.zoomScale > 1) {
      return;
    }

    scrollValueY.setValue(offsetY);
  };

  const onLongPressHandler = useCallback(
    (event: GestureResponderEvent) => {
      onLongPress(imageSrc);
    },
    [imageSrc, onLongPress]
  );

  const onLoaded = useCallback((e: ImageLoadEventData) => {
    setSize({
      width: e.source.width,
      height: e.source.height,
    });

    setLoaded(true);
  }, []);

  const layoutStyle = React.useMemo(
    () => ({
      width: layout.width,
      height: layout.height,
    }),
    [layout]
  );

  return (
    <View>
      <ScrollView
        ref={scrollViewRef}
        style={layoutStyle}
        pinchGestureEnabled
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        maximumZoomScale={maxScale}
        contentContainerStyle={{
          height: layout.height * 2,
        }}
        scrollEnabled={swipeToCloseEnabled}
        onScrollEndDrag={onScrollEndDrag}
        scrollEventThrottle={1}
        {...(swipeToCloseEnabled && {
          onScroll,
        })}
      >
        {!loaded && <ImageLoading style={layoutStyle} />}
        <TouchableWithoutFeedback
          onPress={doubleTapToZoomEnabled ? handleDoubleTap : undefined}
          onLongPress={onLongPressHandler}
          delayLongPress={delayLongPress}
        >
          <AnimatedImage
            {...imageProps}
            source={imageSrc}
            style={[imageStylesWithOpacity]}
            onLoad={onLoaded}
          />
        </TouchableWithoutFeedback>
      </ScrollView>
    </View>
  );
};

export default React.memo(ImageItem);
