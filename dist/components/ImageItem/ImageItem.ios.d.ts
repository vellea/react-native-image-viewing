/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ImageProps } from 'expo-image';
import { ImageSource, Dimensions } from '../../@types';
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
declare const ImageItem: ({ imageSrc, onZoom, onRequestClose, onLongPress, delayLongPress, swipeToCloseEnabled, doubleTapToZoomEnabled, onPress, doubleTapDelay, imageProps, layout, }: Props) => JSX.Element;
export default ImageItem;
