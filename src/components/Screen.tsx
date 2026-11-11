import type { ComponentRef, ReactNode, Ref } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLang, type Content } from '../i18n/LanguageContext';
import { colors, maxContentWidth, spacing } from '../theme';
import { DraftBanner } from './DraftBanner';
import { Notice } from './Notice';

type Props = {
  // Top-level content key; shows a notice when part of it is not yet translated.
  contentKey?: keyof Content;
  // Shows one DRAFT banner at the top when any content on the screen is unreviewed.
  draft?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  scrollRef?: Ref<ComponentRef<typeof ScrollView>>;
  onContentSizeChange?: () => void;
};

export function Screen({ contentKey, draft, children, footer, scrollRef, onContentSizeChange }: Props) {
  const { c, translated } = useLang();
  return (
    <SafeAreaView style={styles.safe} edges={['bottom', 'left', 'right']}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={onContentSizeChange}
      >
        {draft ? <DraftBanner /> : null}
        {contentKey && !translated(contentKey) ? <Notice text={c.ui.notTranslated} /> : null}
        {children}
      </ScrollView>
      {footer}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl * 2,
    width: '100%',
    maxWidth: maxContentWidth,
    alignSelf: 'center',
  },
});
