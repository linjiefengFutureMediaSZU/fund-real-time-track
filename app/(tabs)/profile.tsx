import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert, Switch, useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, MessageSquare, Info, ChevronRight, Edit2, X, LogOut, ShieldCheck, RefreshCw } from 'lucide-react-native';
import { useFunds } from '@/store/FundContext';
import * as LocalAuthentication from 'expo-local-authentication';
import { ThemedText, ThemedView } from '@/components/Themed';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { userProfile, updateUserProfile, resetData } = useFunds();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editBio, setEditBio] = useState('');

  const openEditModal = () => {
    setEditNickname(userProfile.nickname);
    setEditBio(userProfile.bio || '');
    setIsEditModalVisible(true);
  };

  const saveProfile = () => {
    updateUserProfile({
      nickname: editNickname,
      bio: editBio
    });
    setIsEditModalVisible(false);
  };

  const togglePrivacyLock = async () => {
    if (!userProfile.privacyLockEnabled) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('提示', '您的设备不支持生物识别解锁');
        return;
      }
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert('提示', '您尚未在设备中录入指纹或面容');
        return;
      }
    }
    
    updateUserProfile({ privacyLockEnabled: !userProfile.privacyLockEnabled });
  };

  const handleFeedback = () => {
    Alert.alert('意见反馈', '请发送邮件至 feedback@fundtrack.com', [
      { text: '确定' }
    ]);
  };

  const handleAbout = () => {
    Alert.alert('关于我们', '基金实时估值助手 v1.0.0\n\n我们致力于为基民提供最及时、准确的净值估算服务。');
  };

  const MenuItem = ({ icon: Icon, title, subtitle = '', onPress, rightElement, destructive = false }: any) => (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: theme.card, borderColor: theme.border }]}
      onPress={onPress}
      disabled={!!rightElement && !onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: destructive ? theme.danger + '20' : theme.background }]}>
          <Icon size={20} color={destructive ? theme.danger : theme.text} />
        </View>
        <ThemedText style={[styles.menuItemTitle, destructive && { color: theme.danger }]}>{title}</ThemedText>
      </View>
      <View style={styles.menuItemRight}>
        {rightElement ? rightElement : (
          <>
            {subtitle ? <ThemedText style={[styles.menuItemSubtitle, { color: theme.secondaryText }]}>{subtitle}</ThemedText> : null}
            <ChevronRight size={20} color={theme.secondaryText} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}>
        {/* User Header */}
        <TouchableOpacity 
          style={[styles.header, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={openEditModal}
          activeOpacity={0.8}
        >
          <View style={[styles.avatarContainer, { backgroundColor: theme.tint }]}>
            {userProfile.avatar ? (
              <Image source={{ uri: userProfile.avatar }} style={styles.avatarImage} />
            ) : (
              <ThemedText style={styles.avatarText}>{userProfile.nickname.charAt(0)}</ThemedText>
            )}
            <View style={[styles.editBadge, { backgroundColor: theme.tint, borderColor: theme.card }]}>
              <Edit2 size={10} color="#fff" />
            </View>
          </View>
          <View style={styles.userInfo}>
            <ThemedText type="defaultSemiBold" style={styles.nickname}>{userProfile.nickname}</ThemedText>
            <ThemedText style={[styles.userId, { color: theme.secondaryText }]}>ID: {userProfile.id}</ThemedText>
            {userProfile.bio ? (
              <ThemedText style={[styles.bio, { color: theme.secondaryText }]} numberOfLines={1}>
                {userProfile.bio}
              </ThemedText>
            ) : null}
          </View>
          <ChevronRight size={20} color={theme.secondaryText} />
        </TouchableOpacity>

        {/* Menu Groups */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.secondaryText }]}>安全与隐私</ThemedText>
          <MenuItem 
            icon={ShieldCheck} 
            title="隐私锁定" 
            rightElement={
              <Switch 
                value={userProfile.privacyLockEnabled} 
                onValueChange={togglePrivacyLock}
                trackColor={{ false: '#767577', true: theme.tint }}
              />
            } 
          />
          <MenuItem icon={Settings} title="系统设置" onPress={() => router.push('/settings')} />
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.secondaryText }]}>支持</ThemedText>
          <MenuItem icon={MessageSquare} title="意见反馈" onPress={handleFeedback} />
          <MenuItem icon={Info} title="关于我们" subtitle="v1.0.0" onPress={handleAbout} />
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.secondaryText }]}>调试</ThemedText>
          <MenuItem 
            icon={RefreshCw} 
            title="重置初始数据" 
            onPress={() => Alert.alert('确认', '确定要重置所有持仓和设置吗？', [{ text: '取消', style: 'cancel' }, { text: '确定', onPress: resetData }])} 
          />
        </View>

        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: theme.card }]}
          onPress={() => Alert.alert('退出登录', '确定要退出当前账号吗？', [{ text: '取消', style: 'cancel' }, { text: '确定', style: 'destructive', onPress: () => router.replace('/login') }])}
        >
          <LogOut size={20} color="#FF453A" />
          <ThemedText style={styles.logoutText}>退出登录</ThemedText>
        </TouchableOpacity>

        <View style={styles.footer}>
          <ThemedText style={[styles.footerText, { color: theme.secondaryText }]}>Designed & Built with ❤️</ThemedText>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.modalHeader}>
              <ThemedText type="defaultSemiBold">编辑个人资料</ThemedText>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: theme.secondaryText }]}>昵称</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
                value={editNickname}
                onChangeText={setEditNickname}
                placeholder="请输入昵称"
                placeholderTextColor={theme.secondaryText}
              />
            </View>

            <View style={styles.inputGroup}>
              <ThemedText style={[styles.label, { color: theme.secondaryText }]}>个人简介</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border, height: 80 }]}
                value={editBio}
                onChangeText={setEditBio}
                placeholder="介绍一下自己..."
                placeholderTextColor={theme.secondaryText}
                multiline
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: theme.tint }]}
              onPress={saveProfile}
            >
              <ThemedText style={styles.saveButtonText}>保存</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  userInfo: {
    flex: 1,
  },
  nickname: {
    fontSize: 18,
    marginBottom: 4,
  },
  userId: {
    fontSize: 12,
    marginBottom: 2,
  },
  bio: {
    fontSize: 13,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemSubtitle: {
    fontSize: 14,
    marginRight: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  logoutText: {
    color: '#FF453A',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
