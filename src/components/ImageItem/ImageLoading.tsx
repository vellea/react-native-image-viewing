/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { memo } from 'react';

import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

type ImageLoadingProps = {
  style?: StyleProp<ViewStyle>;
};

const ImageLoading = ({ style }: ImageLoadingProps) => (
  <View style={[style, styles.loading]}>
    <ActivityIndicator size="small" color="#FFF" />
  </View>
);

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(ImageLoading);
