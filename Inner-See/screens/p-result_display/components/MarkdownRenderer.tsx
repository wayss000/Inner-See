import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MarkdownRendererProps {
  children: string;
  style?: any;
}

/**
 * 简单的Markdown渲染器
 * 支持基本的markdown语法：标题、粗体、斜体、列表、段落
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children, style }) => {
  if (!children) {
    console.log('MarkdownRenderer: children is empty');
    return <Text style={[styles.paragraph, style]}>内容为空</Text>;
  }

  console.log('MarkdownRenderer: children length:', children.length);
  console.log('MarkdownRenderer: children preview:', children.substring(0, 100));

  // 简单的markdown解析函数
  const parseMarkdown = (text: string): React.ReactNode[] => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];
    let listType: 'ul' | 'ol' | null = null;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <View key={`list-${elements.length}`} style={styles.listContainer}>
            {currentList.map((item, idx) => (
              <View key={idx} style={styles.listItem}>
                <Text style={[styles.listBullet, style]}>
                  {listType === 'ol' ? `${idx + 1}. ` : '• '}
                </Text>
                <Text style={[styles.listText, style]}>{formatInlineMarkdown(item)}</Text>
              </View>
            ))}
          </View>
        );
        currentList = [];
        listType = null;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // 空行
      if (!trimmed) {
        flushList();
        return;
      }

      // 标题
      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <Text key={index} style={[styles.heading3, style]}>
            {formatInlineMarkdown(trimmed.substring(4))}
          </Text>
        );
        return;
      }
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <Text key={index} style={[styles.heading2, style]}>
            {formatInlineMarkdown(trimmed.substring(3))}
          </Text>
        );
        return;
      }
      if (trimmed.startsWith('# ')) {
        flushList();
        elements.push(
          <Text key={index} style={[styles.heading1, style]}>
            {formatInlineMarkdown(trimmed.substring(2))}
          </Text>
        );
        return;
      }

      // 分隔线
      if (trimmed.match(/^---+$/)) {
        flushList();
        elements.push(
          <View key={`hr-${index}`} style={styles.hr} />
        );
        return;
      }

      // 支持 **序号** 格式的标题（如 **① 建立情绪觉察与表达习惯**）
      const boldTitleMatch = trimmed.match(/^\*\*([①-⑳\d]+[\.、]?\s*.+?)\*\*$/);
      if (boldTitleMatch) {
        flushList();
        elements.push(
          <Text key={index} style={[styles.heading3, style]}>
            {formatInlineMarkdown(boldTitleMatch[1])}
          </Text>
        );
        return;
      }

      // 无序列表（但要排除 **粗体** 的情况）
      if (trimmed.startsWith('- ') || (trimmed.startsWith('* ') && !trimmed.startsWith('**'))) {
        if (listType !== 'ul') {
          flushList();
          listType = 'ul';
        }
        const listContent = trimmed.startsWith('- ') ? trimmed.substring(2) : trimmed.substring(2);
        currentList.push(listContent);
        return;
      }

      // 有序列表（支持数字序号和中文序号）
      const olMatch = trimmed.match(/^[①-⑳\d]+[\.、]\s*(.+)$/);
      if (olMatch) {
        if (listType !== 'ol') {
          flushList();
          listType = 'ol';
        }
        currentList.push(olMatch[1]);
        return;
      }

      // 普通段落
      flushList();
      if (trimmed) {
        elements.push(
          <Text key={index} style={[styles.paragraph, style]}>
            {formatInlineMarkdown(trimmed)}
          </Text>
        );
      }
    });

    flushList();
    return elements;
  };

  // 格式化行内markdown（粗体、斜体）
  const formatInlineMarkdown = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let key = 0;

    // 匹配 **粗体** 和 *斜体*（注意：先匹配粗体，避免与斜体冲突）
    const boldRegex = /\*\*(.+?)\*\*/g;
    const italicRegex = /\*(.+?)\*/g;
    
    let lastIndex = 0;
    const matches: Array<{ start: number; end: number; text: string; style: any }> = [];
    const boldMatches: Array<{ start: number; end: number }> = [];

    // 先匹配粗体
    let match;
    boldRegex.lastIndex = 0;
    while ((match = boldRegex.exec(text)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length,
        text: match[1],
        style: styles.bold,
      });
      boldMatches.push({
        start: match.index,
        end: match.index + match[0].length,
      });
    }

    // 再匹配斜体（排除已经被粗体匹配的部分）
    italicRegex.lastIndex = 0;
    while ((match = italicRegex.exec(text)) !== null) {
      // 检查是否与粗体匹配重叠
      const overlaps = boldMatches.some(m => 
        (match.index >= m.start && match.index < m.end) ||
        (match.index + match[0].length > m.start && match.index + match[0].length <= m.end)
      );
      if (!overlaps) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[1],
          style: styles.italic,
        });
      }
    }

    // 按位置排序
    matches.sort((a, b) => a.start - b.start);

    matches.forEach((match) => {
      // 添加匹配前的文本
      if (match.start > lastIndex) {
        parts.push(
          <Text key={key++} style={[styles.paragraph, style]}>
            {text.substring(lastIndex, match.start)}
          </Text>
        );
      }
      // 添加格式化文本
      parts.push(
        <Text key={key++} style={[styles.paragraph, style, match.style]}>
          {match.text}
        </Text>
      );
      lastIndex = match.end;
    });

    // 添加剩余文本
    if (lastIndex < text.length) {
      parts.push(
        <Text key={key++} style={[styles.paragraph, style]}>
          {text.substring(lastIndex)}
        </Text>
      );
    }

    return parts.length > 0 ? parts : [<Text key={0} style={[styles.paragraph, style]}>{text}</Text>];
  };

  try {
    const elements = parseMarkdown(children);
    console.log('MarkdownRenderer: parsed elements count:', elements?.length);
    if (elements && elements.length > 0) {
      return (
        <View style={styles.container}>
          {elements.map((element, index) => {
            // 如果元素已经有key，使用它；否则添加新的key
            if (React.isValidElement(element) && element.key) {
              return element;
            }
            return React.cloneElement(element as React.ReactElement, { key: `md-${index}` });
          })}
        </View>
      );
    } else {
      // 如果解析失败，至少显示原始文本
      console.log('MarkdownRenderer: 解析失败，显示原始文本');
      return <Text style={[styles.paragraph, style]}>{children}</Text>;
    }
  } catch (error) {
    console.error('Markdown渲染错误:', error);
    // 出错时显示原始文本
    return <Text style={[styles.paragraph, style]}>{children}</Text>;
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    minHeight: 20, // 确保容器有最小高度
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: '#ffffff',
    marginBottom: 8,
  },
  heading1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 8,
  },
  heading2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 14,
    marginBottom: 6,
  },
  heading3: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  italic: {
    fontStyle: 'italic',
  },
  listContainer: {
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  listBullet: {
    fontSize: 14,
    color: '#ffffff',
    marginRight: 8,
  },
  listText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#ffffff',
    flex: 1,
  },
  hr: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 16,
  },
});

export default MarkdownRenderer;

