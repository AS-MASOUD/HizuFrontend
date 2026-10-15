"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useToast } from "@/providers/ToastProvider";
import { adminApi } from "@/lib/api/admin";
import { categoriesApi } from "@/lib/api/categories";
import { productsApi } from "@/lib/api/products";
import { articlesApi } from "@/lib/api/articles";
import { contactApi } from "@/lib/api/contact";
import {
  AdminDashboardStats,
  Order,
  SpecialOrder,
  AdminUser,
  Article,
  Category,
  ProductListDto,
  ProductDto,
  ProductComment,
  Course,
  ContactMessage,
} from "@/types";
import { formatPrice, formatDate, toPersianDigits, getImageUrl } from "@/lib/utils/formatters";
import {
  ShieldCheck,
  Package,
  Wrench,
  Users,
  DollarSign,
  Check,
  Send,
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  FolderTree,
  Tag,
  MessageSquare,
  Star,
  Layers,
  CheckCircle2,
  XCircle,
  Hash,
  Eye,
  AlertTriangle,
  GraduationCap,
  Video,
  Server,
  PlayCircle,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import ArticleEditorModal from "@/components/admin/ArticleEditorModal";
import CategoryGridModal from "@/components/admin/CategoryGridModal";
import ProductEditorModal from "@/components/admin/ProductEditorModal";
import CommentReplyModal from "@/components/admin/CommentReplyModal";
import OrderDetailModal from "@/components/admin/OrderDetailModal";
import CourseEditorModal from "@/components/admin/CourseEditorModal";
import ContactMessageModal from "@/components/admin/ContactMessageModal";


export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAdmin, isSysManager, loading: authLoading } = useAuth();
  const { success, error } = useToast();

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [specialOrders, setSpecialOrders] = useState<SpecialOrder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductListDto[]>([]);
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  const [activeTab, setActiveTab] = useState<
    "orders" | "special" | "categories" | "products" | "comments" | "users" | "articles" | "courses" | "messages"
  >("orders");
  const [loading, setLoading] = useState(true);

  // Modals state
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductDto | null>(null);
  const [loadingProductEdit, setLoadingProductEdit] = useState(false);

  const [commentReplyModalOpen, setCommentReplyModalOpen] = useState(false);
  const [commentToReply, setCommentToReply] = useState<ProductComment | null>(null);
  const [commentsFilter, setCommentsFilter] = useState<"all" | "pending" | "approved">("all");

  const [editorModalOpen, setEditorModalOpen] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState<Article | null>(null);

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [courseSearch, setCourseSearch] = useState("");

  const [orderDetailModalOpen, setOrderDetailModalOpen] = useState(false);
  const [orderToView, setOrderToView] = useState<Order | null>(null);

  // Contact messages state
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageToView, setMessageToView] = useState<ContactMessage | null>(null);
  const [messagesFilter, setMessagesFilter] = useState<"all" | "unread" | "read">("all");
  const [messageSearch, setMessageSearch] = useState("");

  // Special order reply state
  const [replyingId, setReplyingId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [quotedPrice, setQuotedPrice] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/login?redirect=/admin");
    }
  }, [authLoading, user, isAdmin, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [s, o, so, cats, prods, comms, u, arts, crs, msgs] = await Promise.all([
        adminApi.getStats(),
        adminApi.getOrders(1, 40),
        adminApi.getSpecialOrders(1, 40),
        categoriesApi.getCategories(false),
        productsApi.getProducts({ pageSize: 100 }),
        adminApi.getComments(),
        adminApi.getUsers(1, 40),
        articlesApi.getArticles(),
        adminApi.getCourses(),
        contactApi.getAdminMessages({ pageSize: 100 }),
      ]);
      setStats(s);
      setOrders(o.items);
      setSpecialOrders(so.items);
      setCategories(cats);
      setProducts(prods.items);
      setComments(comms.items);
      setUsers(u.items);
      setArticles(arts);
      setCourses(crs);
      setContactMessages(msgs.items || []);

    } catch (err: any) {
      error(err.message || "خطا در بارگذاری اطلاعات پنل مدیریت.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  // CATEGORY ACTIONS
  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    try {
      if (categoryData.id) {
        await categoriesApi.updateCategory(categoryData.id, categoryData);
        success("دسته‌بندی با موفقیت بروزرسانی شد.");
      } else {
        await categoriesApi.createCategory(categoryData);
        success("دسته‌بندی جدید با شناسه یکتا اضافه شد.");
      }
      const updatedCats = await categoriesApi.getCategories(false);
      setCategories(updatedCats);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("hizu:categories-updated"));
      }
    } catch (err: any) {
      error(err.message || "خطا در ذخیره دسته‌بندی.");
      throw err;
    }
  };

  const handleDeleteCategory = async (id: number, name: string) => {
    if (!confirm(`آیا از حذف دسته‌بندی «${name}» اطمینان دارید؟`)) return;
    try {
      await categoriesApi.deleteCategory(id);
      success("دسته‌بندی حذف شد.");
      const updatedCats = await categoriesApi.getCategories(false);
      setCategories(updatedCats);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("hizu:categories-updated"));
      }
    } catch (err: any) {
      error(err.message || "خطا در حذف دسته‌بندی.");
    }
  };

  const handleToggleCategoryActive = async (cat: Category) => {
    try {
      await categoriesApi.updateCategory(cat.id, {
        ...cat,
        isActive: !cat.isActive,
      });
      success(`وضعیت دسته‌بندی به ${!cat.isActive ? "فعال" : "غیرفعال"} تغییر یافت.`);
      const updatedCats = await categoriesApi.getCategories(false);
      setCategories(updatedCats);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("hizu:categories-updated"));
      }
    } catch (err: any) {
      error("خطا در تغییر وضعیت دسته‌بندی.");
    }
  };

  // CONTACT MESSAGE ACTIONS
  const handleToggleMessageRead = async (msg: ContactMessage) => {
    try {
      await contactApi.toggleMessageRead(msg.id, !msg.isRead);
      setContactMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, isRead: !msg.isRead } : m))
      );
      if (messageToView?.id === msg.id) {
        setMessageToView((prev) => (prev ? { ...prev, isRead: !msg.isRead } : null));
      }
      success(msg.isRead ? "پیام به عنوان خوانده‌نشده تنظیم شد." : "پیام به عنوان خوانده‌شده تنظیم شد.");
    } catch (err: any) {
      error(err.message || "خطا در تغییر وضعیت پیام.");
    }
  };

  const handleSaveMessageReply = async (id: string, notes: string) => {
    try {
      await contactApi.replyMessage(id, notes);
      setContactMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, adminNotes: notes, isRead: true, repliedAt: new Date().toISOString() }
            : m
        )
      );
      if (messageToView?.id === id) {
        setMessageToView((prev) =>
          prev
            ? { ...prev, adminNotes: notes, isRead: true, repliedAt: new Date().toISOString() }
            : null
        );
      }
      success("یادداشت پیگیری با موفقیت ثبت شد.");
    } catch (err: any) {
      error(err.message || "خطا در ثبت یادداشت.");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("آیا از حذف این پیام اطمینان دارید؟")) return;
    try {
      await contactApi.deleteMessage(id);
      setContactMessages((prev) => prev.filter((m) => m.id !== id));
      if (messageToView?.id === id) {
        setMessageModalOpen(false);
        setMessageToView(null);
      }
      success("پیام با موفقیت حذف شد.");
    } catch (err: any) {
      error(err.message || "خطا در حذف پیام.");
    }
  };

  // PRODUCT ACTIONS
  const handleOpenProductEdit = async (productId: string) => {
    try {
      setLoadingProductEdit(true);
      const fullProd = await productsApi.getProductById(productId);
      setProductToEdit(fullProd);
      setProductModalOpen(true);
    } catch (err: any) {
      error("خطا در بارگذاری مشخصات کامل محصول.");
    } finally {
      setLoadingProductEdit(false);
    }
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      if (productData.id) {
        await productsApi.updateProduct(productData.id, productData);
        success("مشخصات قطعه با موفقیت بروز شد.");
      } else {
        await productsApi.createProduct(productData);
        success("قطعه جدید با کدینگ خودکار ثبت و ذخیره شد.");
      }
      const updatedProds = await productsApi.getProducts({ pageSize: 100 });
      setProducts(updatedProds.items);
    } catch (err: any) {
      error(err.message || "خطا در ذخیره قطعه.");
      throw err;
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`آیا از حذف محصول «${name}» اطمینان دارید؟`)) return;
    try {
      await productsApi.deleteProduct(id);
      success("محصول مورد نظر حذف شد.");
      const updatedProds = await productsApi.getProducts({ pageSize: 100 });
      setProducts(updatedProds.items);
    } catch (err: any) {
      error(err.message || "خطا در حذف محصول.");
    }
  };

  // COMMENT ACTIONS
  const handleToggleCommentApproval = async (id: string, currentApproved: boolean) => {
    try {
      await adminApi.toggleCommentApproval(id, !currentApproved);
      success(!currentApproved ? "دیدگاه با موفقیت تایید و عمومی شد." : "دیدگاه به حالت عدم تایید تغییر یافت.");
      const res = await adminApi.getComments();
      setComments(res.items);
    } catch (err: any) {
      error("خطا در تغییر وضعیت دیدگاه.");
    }
  };

  const handleReplyComment = async (commentId: string, replyText: string) => {
    try {
      await adminApi.replyComment(commentId, replyText);
      success("پاسخ رسمی ادمین ثبت و دیدگاه تایید شد.");
      const res = await adminApi.getComments();
      setComments(res.items);
    } catch (err: any) {
      error("خطا در ثبت پاسخ ادمین.");
      throw err;
    }
  };

  const handleDeleteComment = async (id: string) => {
    if (!confirm("آیا از حذف این دیدگاه اطمینان دارید؟")) return;
    try {
      await adminApi.deleteComment(id);
      success("دیدگاه مورد نظر حذف شد.");
      const res = await adminApi.getComments();
      setComments(res.items);
    } catch (err: any) {
      error("خطا در حذف دیدگاه.");
    }
  };

  // ARTICLE ACTIONS
  const handleSaveArticle = async (articleData: any) => {
    try {
      if (articleData.id) {
        await articlesApi.updateArticle(articleData);
        success("مقاله با موفقیت بروزرسانی شد.");
      } else {
        await articlesApi.createArticle(articleData);
        success("مقاله جدید با موفقیت ذخیره و منتشر شد.");
      }
      const arts = await articlesApi.getArticles();
      setArticles(arts);
    } catch (err: any) {
      error(err.message || "خطا در ذخیره مقاله");
      throw err;
    }
  };

  const handleToggleArticlePublish = async (id: string) => {
    try {
      const updated = await articlesApi.togglePublishStatus(id);
      if (updated) {
        success(
          updated.isPublished
            ? "مقاله در سایت عمومی و منتشر شد."
            : "مقاله به حالت پیش‌نویس (غیرعمومی) تغییر یافت."
        );
        const arts = await articlesApi.getArticles();
        setArticles(arts);
      }
    } catch (err: any) {
      error("خطا در تغییر وضعیت انتشار مقاله.");
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`آیا از حذف مقاله «${title}» اطمینان دارید؟`)) return;
    try {
      await articlesApi.deleteArticle(id);
      success("مقاله مورد نظر حذف شد.");
      const arts = await articlesApi.getArticles();
      setArticles(arts);
    } catch (err: any) {
      error("خطا در حذف مقاله.");
    }
  };

  // COURSE ACTIONS
  const handleSaveCourse = async (courseData: any) => {
    try {
      if (courseToEdit) {
        await adminApi.updateCourse(courseToEdit.id, courseData);
        success("دوره آموزشی با موفقیت بروزرسانی شد.");
      } else {
        await adminApi.createCourse(courseData);
        success("دوره آموزشی جدید با موفقیت اضافه شد.");
      }
      const updatedCourses = await adminApi.getCourses();
      setCourses(updatedCourses);
    } catch (err: any) {
      error(err.message || "خطا در ذخیره دوره آموزشی.");
      throw err;
    }
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (!confirm(`آیا از حذف دوره آموزشی «${title}» اطمینان دارید؟ تمامی قسمت‌ها و ثبت‌نام‌ها حذف خواهند شد.`)) return;
    try {
      await adminApi.deleteCourse(id);
      success("دوره آموزشی حذف شد.");
      const updatedCourses = await adminApi.getCourses();
      setCourses(updatedCourses);
    } catch (err: any) {
      error(err.message || "خطا در حذف دوره آموزشی.");
    }
  };

  const handleToggleCoursePublish = async (id: string) => {
    try {
      const isPub = await adminApi.toggleCoursePublish(id);
      success(
        isPub
          ? "دوره در سایت عمومی و منتشر گردید."
          : "دوره به حالت پیش‌نویس (مخفی) تغییر یافت."
      );
      const updatedCourses = await adminApi.getCourses();
      setCourses(updatedCourses);
    } catch (err: any) {
      error("خطا در تغییر وضعیت انتشار دوره.");
    }
  };


  const handleUpdateOrderStatus = async (orderId: string, status: number) => {
    try {
      await adminApi.updateOrderStatus(orderId, status);
      success("وضعیت سفارش و موجودی انبار با موفقیت بروزرسانی شد.");
      await loadData();
      setOrderToView((prev) =>
        prev && prev.id === orderId
          ? {
              ...prev,
              status,
              isStockDeducted: status === 1 || status === 2 || status === 3,
              statusText:
                status === 0
                  ? "در انتظار پرداخت / تایید"
                  : status === 1
                  ? "در حال آماده‌سازی و ساخت"
                  : status === 2
                  ? "ارسال شده با پست"
                  : status === 3
                  ? "تحویل داده شده به مشتری"
                  : "لغو شده",
            }
          : prev
      );
    } catch (err: any) {
      error(err.message || "خطا در تغییر وضعیت.");
    }
  };

  const handleReplySpecialOrder = async (id: string) => {
    if (!replyText.trim()) return;
    try {
      await adminApi.replySpecialOrder(
        id,
        replyText.trim(),
        quotedPrice ? parseFloat(quotedPrice) : undefined,
        2
      );
      success("پاسخ و استعلام برای مشتری ارسال گردید.");
      setReplyingId(null);
      setReplyText("");
      setQuotedPrice("");
      loadData();
    } catch (err: any) {
      error(err.message || "خطا در ارسال پاسخ.");
    }
  };

  const handleToggleRole = async (targetUser: AdminUser, roleToToggle: string) => {
    try {
      const hasRole = targetUser.roles.includes(roleToToggle);
      let newRoles = hasRole
        ? targetUser.roles.filter((r) => r !== roleToToggle)
        : [...targetUser.roles, roleToToggle];

      if (!newRoles.includes("Customer")) {
        newRoles.push("Customer");
      }

      await adminApi.updateUserRoles(targetUser.id, newRoles);
      success(`نقش ${roleToToggle} برای کاربر ${targetUser.fullName || targetUser.email} بروزرسانی شد.`);
      loadData();
    } catch (err: any) {
      error(err.message || "خطا در تغییر نقش کاربر.");
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center font-mono text-xs text-[#5A626A]">
        CHECKING ADMIN CREDENTIALS...
      </div>
    );
  }

  const filteredComments = comments.filter((c) => {
    if (commentsFilter === "pending") return !c.isApproved;
    if (commentsFilter === "approved") return c.isApproved;
    return true;
  });

  const filteredMessages = contactMessages.filter((m) => {
    if (messagesFilter === "unread" && m.isRead) return false;
    if (messagesFilter === "read" && !m.isRead) return false;
    if (messageSearch.trim()) {
      const q = messageSearch.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.phoneNumber && m.phoneNumber.includes(q)) ||
        (m.subject && m.subject.toLowerCase().includes(q)) ||
        m.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1c211b]/10 pb-6">
        <div>
          {isSysManager ? (
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-purple-900 bg-purple-100 border border-purple-300 px-3 py-1 rounded-full mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
              <span>HIZU CONTROL PANEL // SYSMANAGER (مدیر ارشد)</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HIZU CONTROL PANEL // ADMIN (مدیر سیستم)</span>
            </div>
          )}
          <h1 className="text-3xl font-black text-[#161A1D]">پنل مدیریت هیزو</h1>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-popup rounded-2xl p-5 bg-white border border-[#1c211b]/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[#5A626A]">کل درآمد حاصله:</span>
              <span className="font-mono font-black text-lg text-[#082719] mt-1">
                {formatPrice(stats.totalRevenue)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="card-popup rounded-2xl p-5 bg-white border border-[#1c211b]/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[#5A626A]">سفارش‌های در حال انجام:</span>
              <span className="font-mono font-black text-xl text-[#082719] mt-1">
                {toPersianDigits(stats.pendingOrders)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0284c7] flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="card-popup rounded-2xl p-5 bg-white border border-[#1c211b]/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[#5A626A]">محصولات فعال کاتالوگ:</span>
              <span className="font-mono font-black text-xl text-[#8f6d2f] mt-1">
                {toPersianDigits(products.length)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#8f6d2f] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="card-popup rounded-2xl p-5 bg-white border border-[#1c211b]/10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-[#5A626A]">نظرات جدید کاربران:</span>
              <span className="font-mono font-black text-xl text-[#161A1D] mt-1">
                {toPersianDigits(comments.filter((c) => !c.isApproved).length)}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#5A626A] flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-[#1c211b]/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            activeTab === "orders" ? "bg-[#082719] text-white shadow-sm" : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          سفارش‌های خرید ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab("special")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            activeTab === "special" ? "bg-[#082719] text-white shadow-sm" : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          استعلام‌های ساخت ({specialOrders.length})
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "categories" ? "bg-[#082719] text-white shadow-sm" : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          <FolderTree className="w-3.5 h-3.5" />
          <span>دسته‌بندی‌ها ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "products" ? "bg-[#082719] text-white shadow-sm" : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>قطعات و محصولات ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("comments")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "comments" ? "bg-[#082719] text-white shadow-sm" : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>نظرات و بازخورد ({comments.length})</span>
          {comments.some((c) => !c.isApproved) && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            activeTab === "users" ? "bg-[#082719] text-white shadow-sm" : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          کاربران سیستم ({users.length})
        </button>

        <button
          onClick={() => setActiveTab("articles")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "articles" ? "bg-[#082719] text-white shadow-sm" : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>مقالات و وبلاگ ({articles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("courses")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "courses" ? "bg-[#082719] text-white shadow-sm" : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>دوره‌های آموزشی ({courses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
            activeTab === "messages" ? "bg-[#082719] text-white shadow-sm" : "bg-white text-[#5A626A] hover:bg-[#EDE8DC]"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>پیام‌های تماس ({contactMessages.length})</span>
          {contactMessages.some((m) => !m.isRead) && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* ---------------- CONTENT: CATEGORIES (GRID TABLE) ---------------- */}
      {activeTab === "categories" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#1c211b]/10 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-[#161A1D] flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-[#082719]" />
                <span>جدول دسته‌بندی‌های کاتالوگ فروشگاه</span>
              </h3>
              <p className="text-xs text-[#5A626A] mt-0.5">
                شناسه‌های ساده عددی، تخصیص خودکار نامک (Slug)، و مدیریت سلسله‌مراتبی دسته‌ها
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setCategoryToEdit(null);
                setCategoryModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#082719] text-white text-xs font-bold hover:bg-[#16191d] transition-all shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#dfc79b]" />
              <span>+ افزودن دسته‌بندی جدید</span>
            </button>
          </div>

          {/* Grid Table */}
          <div className="card-popup rounded-2xl overflow-hidden bg-white border border-[#1c211b]/10">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#EFE9DC] text-[#5A4A3A] font-mono text-[11px]">
                  <tr>
                    <th className="p-4">شناسه (ID)</th>
                    <th className="p-4">کد اختصاری</th>
                    <th className="p-4">نام دسته‌بندی</th>
                    <th className="p-4">تعداد قطعات</th>
                    <th className="p-4">ترتیب نمایش</th>
                    <th className="p-4">وضعیت انتشار</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c211b]/08">
                  {categories.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[#5A626A]">
                        دسته‌بندی‌ای ثبت نشده است. بر روی دکمه افزودن کلیک کنید.
                      </td>
                    </tr>
                  ) : (
                    categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-[#FAF7F0] transition-colors">
                        <td className="p-4">
                          <span className="font-mono font-bold text-xs bg-gray-100 text-[#082719] px-2.5 py-1 rounded-md border border-gray-300">
                            #{cat.id}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-[#0284c7]">
                          {cat.code || "—"}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-[#161A1D]">{cat.name}</div>
                          {cat.description && (
                            <div className="text-[11px] text-[#5A626A] line-clamp-1 mt-0.5">
                              {cat.description}
                            </div>
                          )}
                        </td>
                        <td className="p-4 font-mono font-bold text-[#082719]">
                          {toPersianDigits(cat.productCount ?? 0)} عدد
                        </td>
                        <td className="p-4 font-mono text-[#5A626A]">
                          {toPersianDigits(cat.displayOrder ?? 0)}
                        </td>
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => handleToggleCategoryActive(cat)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                              cat.isActive
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-gray-100 text-gray-500 border-gray-300"
                            }`}
                          >
                            {cat.isActive ? "فعال در سایت" : "غیرفعال"}
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setCategoryToEdit(cat);
                                setCategoryModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EDE8DC] text-[#161A1D] transition-colors"
                              title="ویرایش دسته‌بندی"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                              title="حذف دسته‌بندی"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CONTENT: PRODUCTS ---------------- */}
      {activeTab === "products" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#1c211b]/10 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-[#161A1D] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#082719]" />
                <span>مدیریت محصولات و قطعات صنعتی هیزو</span>
              </h3>
              <p className="text-xs text-[#5A626A] mt-0.5">
                کدینگ خودکار SKU، بهینه‌سازی و فشرده‌سازی WebP تصاویر محلی، و ثبت مشخصات ابعادی
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setProductToEdit(null);
                setProductModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#082719] text-white text-xs font-bold hover:bg-[#16191d] transition-all shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#dfc79b]" />
              <span>+ افزودن قطعه / محصول جدید</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="card-popup rounded-2xl overflow-hidden bg-white border border-[#1c211b]/10">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#EFE9DC] text-[#5A4A3A] font-mono text-[11px]">
                  <tr>
                    <th className="p-4">تصویر</th>
                    <th className="p-4">کد فنی (SKU)</th>
                    <th className="p-4">نام قطعه</th>
                    <th className="p-4">دسته‌بندی</th>
                    <th className="p-4">قیمت واحد</th>
                    <th className="p-4">موجودی انبار</th>
                    <th className="p-4">وضعیت</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c211b]/08">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-[#5A626A]">
                        هیچ قطعه یا محصولی یافت نشد. بر روی دکمه افزودن کلیک کنید.
                      </td>
                    </tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF7F0] transition-colors">
                        <td className="p-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                            {p.imageUrl ? (
                              <img src={getImageUrl(p.imageUrl)} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 font-mono text-[9px]">
                                NO IMG
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-mono font-bold text-[#0284c7] text-xs">
                          {p.sku}
                        </td>
                        <td className="p-4 max-w-xs">
                          <div className="font-bold text-[#161A1D] line-clamp-1">{p.name}</div>
                          {p.material && (
                            <div className="text-[10px] text-[#5A626A] mt-0.5 font-mono">
                              متریال: {p.material}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-[#EDE8DC] text-[#082719] text-[10px] font-bold">
                            {p.categoryName}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-[#082719]">
                          {formatPrice(p.price)}
                        </td>
                        <td className="p-4 font-mono">
                          {p.stockQuantity > 0 ? (
                            <span className="text-emerald-700 font-bold">
                              {toPersianDigits(p.stockQuantity)} عدد
                            </span>
                          ) : (
                            <span className="text-rose-600 font-bold">ناموجود</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              p.isActive
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-gray-100 text-gray-500 border-gray-300"
                            }`}
                          >
                            {p.isActive ? "فعال" : "غیرفعال"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenProductEdit(p.id)}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EDE8DC] text-[#161A1D] transition-colors"
                              title="ویرایش قطعه"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <Link
                              href={`/product/${p.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0284c7] transition-colors"
                              title="مشاهده صفحه قطعه"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                              title="حذف قطعه"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CONTENT: COMMENTS & FEEDBACK ---------------- */}
      {activeTab === "comments" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#1c211b]/10 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-[#161A1D] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#082719]" />
                <span>نظرات و بازخورد کاربران بر روی محصولات</span>
              </h3>
              <p className="text-xs text-[#5A626A] mt-0.5">
                تنها دیدگاه‌های تایید شده توسط مدیر در سایت نمایش داده می‌شوند؛ پاسخ فقط توسط ادمین امکان‌پذیر است.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 bg-[#FAF7F0] p-1 rounded-xl border border-[#1c211b]/10">
              <button
                type="button"
                onClick={() => setCommentsFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  commentsFilter === "all"
                    ? "bg-[#082719] text-white"
                    : "text-[#5A626A] hover:text-[#161A1D]"
                }`}
              >
                همه ({comments.length})
              </button>
              <button
                type="button"
                onClick={() => setCommentsFilter("pending")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  commentsFilter === "pending"
                    ? "bg-amber-600 text-white"
                    : "text-amber-700 hover:bg-amber-50"
                }`}
              >
                در انتظار تایید ({comments.filter((c) => !c.isApproved).length})
              </button>
              <button
                type="button"
                onClick={() => setCommentsFilter("approved")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  commentsFilter === "approved"
                    ? "bg-emerald-700 text-white"
                    : "text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                تایید شده ({comments.filter((c) => c.isApproved).length})
              </button>
            </div>
          </div>

          {/* Comments Table */}
          <div className="card-popup rounded-2xl overflow-hidden bg-white border border-[#1c211b]/10">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#EFE9DC] text-[#5A4A3A] font-mono text-[11px]">
                  <tr>
                    <th className="p-4">نویسنده</th>
                    <th className="p-4">محصول</th>
                    <th className="p-4">امتیاز</th>
                    <th className="p-4 max-w-sm">متن دیدگاه</th>
                    <th className="p-4">پاسخ رسمی ادمین</th>
                    <th className="p-4">وضعیت</th>
                    <th className="p-4">تاریخ</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c211b]/08">
                  {filteredComments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-[#5A626A]">
                        دیدگاهی در این دسته‌بندی یافت نشد.
                      </td>
                    </tr>
                  ) : (
                    filteredComments.map((c) => (
                      <tr key={c.id} className="hover:bg-[#FAF7F0] transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-[#161A1D]">{c.authorName}</div>
                          {c.authorEmail && (
                            <div className="text-[10px] text-[#5A626A] font-mono">{c.authorEmail}</div>
                          )}
                        </td>
                        <td className="p-4 font-bold text-[#082719]">
                          {c.productName || "محصول فروشگاه"}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < c.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="p-4 max-w-xs">
                          <p className="text-xs text-[#161A1D] leading-relaxed line-clamp-2">
                            {c.content}
                          </p>
                        </td>
                        <td className="p-4 max-w-xs">
                          {c.adminReply ? (
                            <div className="text-xs text-emerald-800 line-clamp-2 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                              {c.adminReply}
                            </div>
                          ) : (
                            <span className="text-[11px] text-gray-400">ثبت نشده</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              c.isApproved
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-amber-100 text-amber-800 border-amber-300"
                            }`}
                          >
                            {c.isApproved ? "تایید شده (عمومی)" : "در انتظار تایید"}
                          </span>
                        </td>
                        <td className="p-4 text-[11px] text-[#5A626A]">
                          {formatDate(c.createdAt)}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* Toggle Approval */}
                            <button
                              type="button"
                              onClick={() => handleToggleCommentApproval(c.id, c.isApproved)}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                                c.isApproved
                                  ? "bg-amber-50 hover:bg-amber-100 text-amber-800"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800"
                              }`}
                              title={c.isApproved ? "لغو تایید دیدگاه" : "تایید و انتشار دیدگاه"}
                            >
                              {c.isApproved ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                            </button>

                            {/* Reply Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setCommentToReply(c);
                                setCommentReplyModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0284c7] transition-colors"
                              title="ثبت / ویرایش پاسخ مدیر"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(c.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                              title="حذف دیدگاه"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CONTENT: ORDERS ---------------- */}
      {activeTab === "orders" && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#1c211b]/10 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-[#161A1D] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#082719]" />
                <span>مدیریت و نظارت بر سفارش‌های خرید مشتریان</span>
              </h3>
              <p className="text-xs text-[#5A626A] mt-0.5">
                بررسی اقلام خریداری شده، آدرس تحویل پستی، تایید نهایی سفارش، کسر خودکار از موجودی انبار و چاپ فاکتور
              </p>
            </div>
          </div>

          <div className="card-popup rounded-2xl overflow-hidden bg-white border border-[#1c211b]/10">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#EFE9DC] text-[#5A4A3A] font-mono text-[11px]">
                  <tr>
                    <th className="p-4">شماره فاکتور</th>
                    <th className="p-4">مشخصات خریدار</th>
                    <th className="p-4">اقلام سفارش</th>
                    <th className="p-4">وضعیت انبار</th>
                    <th className="p-4">مبلغ فاکتور</th>
                    <th className="p-4">تاریخ ثبت</th>
                    <th className="p-4">وضعیت جاری</th>
                    <th className="p-4">تغییر وضعیت</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c211b]/08">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-[#5A626A]">
                        هیچ سفارشی در سیستم ثبت نشده است.
                      </td>
                    </tr>
                  ) : (
                    orders.map((o) => (
                      <tr key={o.id} className="hover:bg-[#FAF7F0] transition-colors">
                        <td className="p-4">
                          <button
                            type="button"
                            onClick={() => {
                              setOrderToView(o);
                              setOrderDetailModalOpen(true);
                            }}
                            className="font-mono font-bold text-[#082719] hover:text-[#0284c7] hover:underline flex items-center gap-1.5"
                          >
                            <span>{o.orderNumber}</span>
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-[#161A1D]">{o.customerName || "کاربر مهمان"}</div>
                          {o.customerPhone ? (
                            <div className="font-mono text-[11px] text-[#0284c7] dir-ltr mt-0.5">
                              {o.customerPhone}
                            </div>
                          ) : o.customerEmail ? (
                            <div className="font-mono text-[10px] text-[#5A626A] dir-ltr mt-0.5 line-clamp-1">
                              {o.customerEmail}
                            </div>
                          ) : null}
                        </td>
                        <td className="p-4 max-w-[200px]">
                          {o.items.map((i) => (
                            <div key={i.id} className="font-mono text-[11px] text-[#5A626A] line-clamp-1">
                              {i.productName} × {toPersianDigits(i.quantity)}
                            </div>
                          ))}
                        </td>
                        <td className="p-4">
                          {o.isStockDeducted ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full text-[10px]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>کسر از انبار</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full text-[10px]">
                              <AlertTriangle className="w-3 h-3" />
                              <span>در انتظار تایید</span>
                            </span>
                          )}
                        </td>
                        <td className="p-4 font-mono font-bold text-[#082719]">{formatPrice(o.total)}</td>
                        <td className="p-4 text-[#5A626A]">{formatDate(o.createdAt)}</td>
                        <td className="p-4">
                          <span
                            className={`font-bold px-2 py-0.5 rounded text-[10px] border ${
                              o.status === 0
                                ? "bg-amber-100 text-amber-800 border-amber-300"
                                : o.status === 1
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : o.status === 2
                                ? "bg-purple-100 text-purple-800 border-purple-300"
                                : o.status === 3
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                : "bg-rose-100 text-rose-800 border-rose-300"
                            }`}
                          >
                            {o.statusText}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateOrderStatus(o.id, parseInt(e.target.value, 10))}
                            className="border border-gray-300 rounded-lg px-2.5 py-1 text-xs bg-white cursor-pointer focus:outline-none focus:border-[#082719]"
                          >
                            <option value={0}>در انتظار پرداخت / تایید</option>
                            <option value={1}>در حال ساخت (کسر انبار)</option>
                            <option value={2}>ارسال شده با پست</option>
                            <option value={3}>تحویل شده به مشتری</option>
                            <option value={4}>لغو شده (برگشت موجودی)</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setOrderToView(o);
                              setOrderDetailModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF7F0] hover:bg-[#EDE8DC] text-[#082719] font-bold border border-[#1c211b]/15 transition-all text-[11px]"
                            title="مشاهده جزئیات کامل سفارش"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#0284c7]" />
                            <span>جزئیات</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CONTENT: SPECIAL ORDERS ---------------- */}
      {activeTab === "special" && (
        <div className="flex flex-col gap-4">
          {specialOrders.map((so) => (
            <div
              key={so.id}
              className="card-popup rounded-2xl p-6 bg-white border border-[#1c211b]/10 flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c211b]/10 pb-3">
                <div>
                  <span className="font-mono text-[11px] text-[#0284c7] font-bold">{so.orderNumber}</span>
                  <h3 className="font-bold text-base text-[#161A1D]">{so.title}</h3>
                  <span className="text-xs text-[#5A626A]">
                    مشتری: {so.customerName} ({so.customerPhone}) • تاریخ: {formatDate(so.createdAt)}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#8f6d2f] bg-[#EDE8DC] px-3 py-1 rounded-full self-start sm:self-auto">
                  {so.statusText}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-[#FAF7F0] p-4 rounded-xl">
                <div>
                  <span className="text-[#5A626A]">فرآیند درخواستی:</span>
                  <p className="font-bold text-[#161A1D]">{so.category}</p>
                </div>
                <div>
                  <span className="text-[#5A626A]">متریال:</span>
                  <p className="font-bold text-[#161A1D]">{so.materialPreference || "نامشخص"}</p>
                </div>
                <div>
                  <span className="text-[#5A626A]">بودجه تقریبی:</span>
                  <p className="font-mono font-bold text-[#082719]">
                    {so.estimatedBudget ? formatPrice(so.estimatedBudget) : "مشخص نشده"}
                  </p>
                </div>
              </div>

              <div className="text-xs text-[#5A626A] leading-relaxed">
                <span className="font-bold text-[#161A1D]">توضیحات و شرح فنی: </span>
                {so.description}
              </div>

              {so.images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs font-bold text-[#161A1D] w-full">فایل‌های ارسالی مشتری:</span>
                  {so.images.map((img) => (
                    <a
                      key={img.id}
                      href={img.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDE8DC] rounded-lg text-xs font-mono text-[#082719] hover:bg-[#dfc79b]"
                    >
                      <span>{img.originalFileName || "Technical-Drawing"}</span>
                    </a>
                  ))}
                </div>
              )}

              {/* Reply / Quote Box */}
              {replyingId === so.id ? (
                <div className="p-4 bg-gray-50 border rounded-xl flex flex-col gap-3 text-xs mt-2">
                  <span className="font-bold text-[#161A1D]">پاسخ کارشناسی و اعلام قیمت:</span>
                  <textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="تحلیل DFM، زمان تحویل و شرایط فنی..."
                    className="w-full bg-white border p-3 rounded-lg text-xs"
                  />
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={quotedPrice}
                      onChange={(e) => setQuotedPrice(e.target.value)}
                      placeholder="قیمت کارشناسی نهایی (تومان)"
                      className="bg-white border px-3 py-2 rounded-lg text-xs font-mono dir-ltr"
                    />
                    <button
                      onClick={() => handleReplySpecialOrder(so.id)}
                      className="bg-[#082719] text-white px-5 py-2 rounded-lg font-bold"
                    >
                      ثبت و ارسال به مشتری
                    </button>
                    <button
                      onClick={() => setReplyingId(null)}
                      className="text-gray-500 px-3 py-2"
                    >
                      انصراف
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2 border-t">
                  {so.adminReply ? (
                    <div className="text-xs text-emerald-800">
                      <span className="font-bold">پاسخ ثبت شده: </span>
                      {so.adminReply}
                      {so.quotedPrice && ` (${formatPrice(so.quotedPrice)})`}
                    </div>
                  ) : (
                    <span className="text-xs text-amber-700">هنوز پاسخی ثبت نشده است.</span>
                  )}
                  <button
                    onClick={() => {
                      setReplyingId(so.id);
                      setReplyText(so.adminReply || "");
                      setQuotedPrice(so.quotedPrice ? so.quotedPrice.toString() : "");
                    }}
                    className="text-xs font-bold text-[#082719] bg-[#EDE8DC] hover:bg-[#dfc79b] px-4 py-1.5 rounded-full transition-colors"
                  >
                    {so.adminReply ? "ویرایش پاسخ" : "ثبت پاسخ و قیمت"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ---------------- CONTENT: USERS ---------------- */}
      {activeTab === "users" && (
        <div className="card-popup rounded-2xl overflow-hidden bg-white border border-[#1c211b]/10">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#EFE9DC] text-[#5A4A3A] font-mono text-[11px]">
                <tr>
                  <th className="p-4">نام کاربر</th>
                  <th className="p-4">ایمیل</th>
                  <th className="p-4">تلفن</th>
                  <th className="p-4">نقش‌ها</th>
                  <th className="p-4">تعداد سفارشات</th>
                  <th className="p-4">تاریخ ثبت‌نام</th>
                  <th className="p-4 text-center">مدیریت دسترسی (SysManager)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c211b]/08">
                {users.map((u) => {
                  const hasAdmin = u.roles.includes("Admin");
                  const hasSysManager = u.roles.includes("SysManager");
                  const isRootAdmin = u.email === "admin@hizu.ir";

                  return (
                    <tr key={u.id} className="hover:bg-[#FAF7F0] transition-colors">
                      <td className="p-4 font-bold text-[#161A1D]">{u.fullName}</td>
                      <td className="p-4 font-mono dir-ltr text-right">{u.email}</td>
                      <td className="p-4 font-mono dir-ltr text-right">{u.phoneNumber || "—"}</td>
                      <td className="p-4">
                        <div className="flex gap-1 flex-wrap">
                          {u.roles.map((r) => {
                            const isSys = r === "SysManager";
                            const isAdm = r === "Admin";
                            return (
                              <span
                                key={r}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                  isSys
                                    ? "bg-purple-100 text-purple-800 border-purple-200"
                                    : isAdm
                                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                    : "bg-[#EDE8DC] text-[#161A1D] border-[#1c211b]/10"
                                }`}
                              >
                                {isSys ? "مدیر ارشد (SysManager)" : isAdm ? "مدیر سیستم (Admin)" : "مشتری"}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold">{toPersianDigits(u.ordersCount)}</td>
                      <td className="p-4 text-[#5A626A]">{formatDate(u.createdAt)}</td>
                      <td className="p-4 text-center">
                        {isSysManager ? (
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleToggleRole(u, "Admin")}
                              disabled={isRootAdmin && hasAdmin}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border shadow-2xs ${
                                hasAdmin
                                  ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200"
                                  : "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300"
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                            >
                              {hasAdmin ? "حذف دسترسی Admin" : "+ افزودن دسترسی Admin"}
                            </button>

                            <button
                              onClick={() => handleToggleRole(u, "SysManager")}
                              disabled={isRootAdmin}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border shadow-2xs ${
                                hasSysManager
                                  ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300"
                                  : "bg-purple-50 hover:bg-purple-100 text-purple-800 border-purple-300"
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                            >
                              {hasSysManager ? "تنزل از SysManager" : "+ ارتقا به SysManager"}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-400">مخصوص مدیر ارشد</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------- CONTENT: ARTICLES ---------------- */}
      {activeTab === "articles" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#1c211b]/10 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-[#161A1D]">مدیریت مقالات، وبلاگ و آموزش‌ها</h3>
              <p className="text-xs text-[#5A626A] mt-0.5">
                تولید محتوا، مقایسه فیلامنت‌ها، مستندسازی طراحی محصول، و مدیریت وضعیت انتشار
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setArticleToEdit(null);
                setEditorModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#082719] text-white text-xs font-bold hover:bg-[#162b20] transition-all shadow-md self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#dfc79b]" />
              <span>+ نوشتن مقاله جدید</span>
            </button>
          </div>

          <div className="card-popup rounded-2xl overflow-hidden bg-white border border-[#1c211b]/10">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#EFE9DC] text-[#5A4A3A] font-mono text-[11px]">
                  <tr>
                    <th className="p-4">تصویر شاخص</th>
                    <th className="p-4">عنوان و موضوع مقاله</th>
                    <th className="p-4">دسته‌بندی</th>
                    <th className="p-4">وضعیت انتشار</th>
                    <th className="p-4">زمان مطالعه</th>
                    <th className="p-4">تاریخ ثبت</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c211b]/08">
                  {articles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-[#5A626A]">
                        هنوز مقاله‌ای ثبت نشده است.
                      </td>
                    </tr>
                  ) : (
                    articles.map((art) => (
                      <tr key={art.id} className="hover:bg-[#FAF7F0] transition-colors">
                        <td className="p-4">
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 border shrink-0">
                            {art.coverImage ? (
                              <img src={art.coverImage} alt={art.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <BookOpen className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="p-4 max-w-xs sm:max-w-md">
                          <div className="font-bold text-[#161A1D] line-clamp-1">{art.title}</div>
                          <div className="text-[11px] text-[#5A626A] line-clamp-1 mt-0.5">
                            {art.summary}
                          </div>
                          <div className="font-mono text-[10px] text-[#0284c7] dir-ltr text-right mt-1">
                            /articles/{art.slug}
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-[#EDE8DC] text-[#082719] text-[10px] font-bold">
                            {art.category}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                art.isPublished
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                  : "bg-amber-100 text-amber-800 border-amber-200"
                              }`}
                            >
                              {art.isPublished ? "منتشر شده (عمومی)" : "پیش‌نویس"}
                            </span>

                            <button
                              type="button"
                              onClick={() => handleToggleArticlePublish(art.id)}
                              className="text-[10px] text-[#5A626A] hover:text-[#082719] underline font-medium"
                            >
                              {art.isPublished ? "تبدیل به پیش‌نویس" : "انتشار فوری"}
                            </button>
                          </div>
                        </td>

                        <td className="p-4 font-mono text-[#5A626A]">
                          {toPersianDigits(art.readTimeMinutes)} دقیقه
                        </td>

                        <td className="p-4 text-[#5A626A] text-[11px]">
                          {formatDate(art.createdAt)}
                        </td>

                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setArticleToEdit(art);
                                setEditorModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EDE8DC] text-[#161A1D] transition-colors"
                              title="ویرایش مقاله"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <Link
                              href={`/articles/${art.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0284c7] transition-colors"
                              title="مشاهده مقاله در سایت"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDeleteArticle(art.id, art.title)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                              title="حذف مقاله"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CONTENT: COURSES ---------------- */}
      {activeTab === "courses" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#1c211b]/10 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-[#161A1D] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#082719]" />
                <span>مدیریت دوره‌های آموزشی، ضبط و پیش‌ثبت‌نام‌ها</span>
              </h3>
              <p className="text-xs text-[#5A626A] mt-0.5">
                ایجاد دوره جدید، تعیین وضعیت پیش‌ثبت‌نام (رزرو بدون شهریه) یا فروش با شهریه پس از ضبط، مدیریت لینک‌های فایل‌سرور
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="جستجوی عنوان، مدرس، نامک..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="bg-[#FAF7F0] border border-[#1c211b]/15 rounded-full px-4 py-2 text-xs text-[#161A1D] w-56 focus:outline-none focus:border-[#082719]"
              />

              <button
                type="button"
                onClick={() => {
                  setCourseToEdit(null);
                  setCourseModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#082719] text-white text-xs font-bold hover:bg-[#162b20] transition-all shadow-md shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#dfc79b]" />
                <span>+ ایجاد دوره جدید</span>
              </button>
            </div>
          </div>

          <div className="card-popup rounded-2xl overflow-hidden bg-white border border-[#1c211b]/10">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#EFE9DC] text-[#5A4A3A] font-mono text-[11px]">
                  <tr>
                    <th className="p-4">کاور و دوره</th>
                    <th className="p-4">مدرس</th>
                    <th className="p-4">لینک‌های فایل‌سرور و ویدیو</th>
                    <th className="p-4">شهریه و وضعیت ثبت‌نام</th>
                    <th className="p-4">سطح و مدت</th>
                    <th className="p-4">شرکت‌کنندگان / رزروها</th>
                    <th className="p-4">وضعیت انتشار</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c211b]/08">
                  {courses.filter((c) => {
                    if (!courseSearch.trim()) return true;
                    const s = courseSearch.trim().toLowerCase();
                    return (
                      c.title.toLowerCase().includes(s) ||
                      (c.subtitle && c.subtitle.toLowerCase().includes(s)) ||
                      c.instructorName.toLowerCase().includes(s) ||
                      c.slug.toLowerCase().includes(s)
                    );
                  }).length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-[#5A626A]">
                        هیچ دوره آموزشی ثبت نشده است. برای ثبت اولین دوره روی دکمه «+ ایجاد دوره جدید» کلیک کنید.
                      </td>
                    </tr>
                  ) : (
                    courses
                      .filter((c) => {
                        if (!courseSearch.trim()) return true;
                        const s = courseSearch.trim().toLowerCase();
                        return (
                          c.title.toLowerCase().includes(s) ||
                          (c.subtitle && c.subtitle.toLowerCase().includes(s)) ||
                          c.instructorName.toLowerCase().includes(s) ||
                          c.slug.toLowerCase().includes(s)
                        );
                      })
                      .map((c) => {
                        const isReserved = c.isReservationOnly || c.price === null || c.price === 0;
                        return (
                          <tr key={c.id} className="hover:bg-[#FAF7F0] transition-colors">
                            {/* 1. Cover & Title */}
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-16 h-11 rounded-lg overflow-hidden bg-gray-900 border shrink-0">
                                  {c.coverImageUrl ? (
                                    <img
                                      src={getImageUrl(c.coverImageUrl)}
                                      alt={c.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[#dfc79b] bg-[#082719]">
                                      <GraduationCap className="w-5 h-5 opacity-70" />
                                    </div>
                                  )}
                                </div>
                                <div className="max-w-xs">
                                  <div className="font-bold text-[#161A1D] line-clamp-1 flex items-center gap-1.5">
                                    <span>{c.title}</span>
                                    {c.isFeatured && (
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#082719] text-[#dfc79b]">
                                        منتخب
                                      </span>
                                    )}
                                  </div>
                                  {c.subtitle && (
                                    <div className="text-[11px] text-[#5A626A] line-clamp-1 mt-0.5">
                                      {c.subtitle}
                                    </div>
                                  )}
                                  <div className="font-mono text-[10px] text-[#0284c7] dir-ltr text-right mt-0.5">
                                    /courses/{c.slug}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* 2. Instructor */}
                            <td className="p-4">
                              <div className="font-bold text-[#161A1D]">{c.instructorName || "تیم فنی هیزو"}</div>
                              {c.instructorTitle && (
                                <div className="text-[10px] text-[#5A626A] line-clamp-1">{c.instructorTitle}</div>
                              )}
                            </td>

                            {/* 3. File Server & Video Links */}
                            <td className="p-4">
                              <div className="flex flex-col gap-1 max-w-[190px]">
                                {c.introVideoUrl ? (
                                  <a
                                    href={c.introVideoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md font-mono transition-colors truncate"
                                    title={c.introVideoUrl}
                                  >
                                    <PlayCircle className="w-3 h-3 text-blue-600 shrink-0" />
                                    <span className="truncate">ویدیو معرفی / تیزر</span>
                                    <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-70" />
                                  </a>
                                ) : (
                                  <span className="text-[10px] text-gray-400">بدون ویدیوی تیزر</span>
                                )}

                                {(c.fileServerBaseUrl || c.storagePath) && (
                                  <div className="inline-flex items-center gap-1 text-[10px] text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md font-mono truncate" title={`${c.fileServerBaseUrl || ""}${c.storagePath || ""}`}>
                                    <Server className="w-3 h-3 text-gray-500 shrink-0" />
                                    <span className="truncate">{c.storagePath || c.fileServerBaseUrl}</span>
                                  </div>
                                )}

                                {c.downloadableFilesUrl && (
                                  <a
                                    href={c.downloadableFilesUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md font-mono transition-colors truncate"
                                    title={c.downloadableFilesUrl}
                                  >
                                    <ExternalLink className="w-2.5 h-2.5 shrink-0 text-emerald-600" />
                                    <span className="truncate">فایل‌های تمرینی</span>
                                  </a>
                                )}
                              </div>
                            </td>

                            {/* 4. Pricing & Reservation */}
                            <td className="p-4">
                              {isReserved ? (
                                <div className="flex flex-col gap-1">
                                  <span className="inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-[10px] bg-amber-100 text-amber-900 border border-amber-300 w-fit">
                                    <Sparkles className="w-3 h-3 text-amber-600" />
                                    <span>در حال ضبط (رزرو رایگان)</span>
                                  </span>
                                  <span className="text-[10px] text-gray-400">بدون شهریه فعلی</span>
                                </div>
                              ) : (
                                <div className="flex flex-col">
                                  {c.compareAtPrice && c.compareAtPrice > (c.price ?? 0) && (
                                    <span className="font-mono text-[10px] text-gray-400 line-through">
                                      {formatPrice(c.compareAtPrice)}
                                    </span>
                                  )}
                                  <span className="font-mono font-bold text-sm text-[#082719]">
                                    {formatPrice(c.price ?? 0)}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* 5. Level & Duration */}
                            <td className="p-4">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-bold text-[11px] text-[#161A1D]">{c.levelTitle}</span>
                                <span className="font-mono text-[10px] text-[#5A626A]">
                                  {c.durationText || `${c.durationMinutes} دقیقه`}
                                </span>
                              </div>
                            </td>

                            {/* 6. Students & Reservations count */}
                            <td className="p-4">
                              <div className="flex items-center gap-1 font-mono font-bold text-xs text-[#082719]">
                                <Users className="w-3.5 h-3.5 text-[#8f6d2f]" />
                                <span>{toPersianDigits(c.studentsCount)}</span>
                                <span className="text-[10px] font-normal text-[#5A626A]">{isReserved ? "رزرو" : "دانشجو"}</span>
                              </div>
                            </td>

                            {/* 7. Publish toggle */}
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                    c.isPublished
                                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                      : "bg-amber-100 text-amber-800 border-amber-200"
                                  }`}
                                >
                                  {c.isPublished ? "منتشر شده" : "پیش‌نویس"}
                                </span>

                                <button
                                  type="button"
                                  onClick={() => handleToggleCoursePublish(c.id)}
                                  className="text-[10px] text-[#5A626A] hover:text-[#082719] underline font-medium cursor-pointer"
                                >
                                  {c.isPublished ? "مخفی‌سازی" : "انتشار فوری"}
                                </button>
                              </div>
                            </td>

                            {/* 8. Actions */}
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCourseToEdit(c);
                                    setCourseModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#EDE8DC] text-[#161A1D] transition-colors cursor-pointer"
                                  title="ویرایش دوره آموزشی و تغییر شهریه"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                <Link
                                  href={`/courses/${c.slug}`}
                                  target="_blank"
                                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0284c7] transition-colors"
                                  title="مشاهده صفحه دوره در سایت"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteCourse(c.id, c.title)}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer"
                                  title="حذف دوره"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CONTENT: CONTACT MESSAGES ---------------- */}
      {activeTab === "messages" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-[#1c211b]/10 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-[#161A1D] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#082719]" />
                <span>پیام‌ها و استعلام‌های ارسالی کاربران از صفحه تماس</span>
              </h3>
              <p className="text-xs text-[#5A626A] mt-0.5">
                پیام‌های دریافتی از فرم تماس با ما، همراه با امکان بررسی، پاسخ ایمیلی، یادداشت مدیر و پیگیری
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative min-w-[200px]">
                <input
                  type="text"
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  placeholder="جستجو در پیام‌ها یا نام..."
                  className="w-full bg-[#FAF7F0] border border-[#1c211b]/15 rounded-xl pr-3 pl-8 py-1.5 text-xs text-[#161A1D] focus:outline-none focus:border-[#082719]"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-[#FAF7F0] p-1 rounded-xl border border-[#1c211b]/10">
                <button
                  type="button"
                  onClick={() => setMessagesFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    messagesFilter === "all"
                      ? "bg-[#082719] text-white"
                      : "text-[#5A626A] hover:text-[#161A1D]"
                  }`}
                >
                  همه ({contactMessages.length})
                </button>
                <button
                  type="button"
                  onClick={() => setMessagesFilter("unread")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    messagesFilter === "unread"
                      ? "bg-rose-700 text-white"
                      : "text-rose-700 hover:bg-rose-50"
                  }`}
                >
                  بررسی‌نشده ({contactMessages.filter((m) => !m.isRead).length})
                </button>
                <button
                  type="button"
                  onClick={() => setMessagesFilter("read")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    messagesFilter === "read"
                      ? "bg-emerald-700 text-white"
                      : "text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  خوانده شده ({contactMessages.filter((m) => m.isRead).length})
                </button>
              </div>
            </div>
          </div>

          {/* Messages Table */}
          <div className="card-popup rounded-2xl overflow-hidden bg-white border border-[#1c211b]/10">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-[#EFE9DC] text-[#5A4A3A] font-mono text-[11px]">
                  <tr>
                    <th className="p-4">فرستنده</th>
                    <th className="p-4">ارتباط</th>
                    <th className="p-4">موضوع و متن پیام</th>
                    <th className="p-4">وضعیت</th>
                    <th className="p-4">تاریخ ثبت</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1c211b]/08">
                  {filteredMessages.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-[#5A626A]">
                        {messageSearch
                          ? "پیامی با مشخصات جستجو شده یافت نشد."
                          : "تاکنون هیچ پیامی از فرم تماس ارسال نشده است."}
                      </td>
                    </tr>
                  ) : (
                    filteredMessages.map((msg) => (
                      <tr
                        key={msg.id}
                        className={`hover:bg-[#FAF7F0]/60 transition-colors ${
                          !msg.isRead ? "bg-rose-50/30" : ""
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                !msg.isRead
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-[#EDE8DC] text-[#5A626A]"
                              }`}
                            >
                              {msg.name.slice(0, 1)}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-[#161A1D]">
                                {msg.name}
                              </span>
                              {!msg.isRead && (
                                <span className="text-[10px] text-rose-600 font-semibold">
                                  ● جدید
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <a
                              href={`mailto:${msg.email}`}
                              className="font-mono text-xs text-[#0284c7] hover:underline dir-ltr text-right flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3 shrink-0" />
                              <span>{msg.email}</span>
                            </a>
                            {msg.phoneNumber && (
                              <a
                                href={`tel:${msg.phoneNumber}`}
                                className="font-mono text-[11px] text-[#5A626A] hover:underline dir-ltr text-right flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3 shrink-0" />
                                <span>{msg.phoneNumber}</span>
                              </a>
                            )}
                          </div>
                        </td>

                        <td className="p-4 max-w-md">
                          <div className="flex flex-col gap-1">
                            {msg.subject && (
                              <span className="font-bold text-[#161A1D]">
                                {msg.subject}
                              </span>
                            )}
                            <p className="text-[#5A626A] line-clamp-2 leading-relaxed">
                              {msg.message}
                            </p>
                            {msg.adminNotes && (
                              <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded mt-1 w-fit flex items-center gap-1">
                                <MessageSquare className="w-2.5 h-2.5" />
                                <span>دارای یادداشت پیگیری</span>
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-4">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                              msg.isRead
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                            }`}
                          >
                            {msg.isRead ? "بررسی شده" : "جدید (بررسی‌نشده)"}
                          </span>
                        </td>

                        <td className="p-4 text-[#5A626A] whitespace-nowrap text-[11px]">
                          {formatDate(msg.createdAt)}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setMessageToView(msg);
                                setMessageModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-[#EDE8DC] hover:bg-[#dfc79b] text-[#082719] transition-colors"
                              title="مشاهده جزئیات و پاسخ"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleMessageRead(msg)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                msg.isRead
                                  ? "bg-gray-100 hover:bg-gray-200 text-[#5A626A]"
                                  : "bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                              }`}
                              title={
                                msg.isRead
                                  ? "علامت‌گذاری به عنوان خوانده نشده"
                                  : "علامت‌گذاری به عنوان خوانده شده"
                              }
                            >
                              <Check className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                              title="حذف پیام"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}


      {/* Category Grid Modal */}
      <CategoryGridModal
        isOpen={categoryModalOpen}
        onClose={() => {
          setCategoryModalOpen(false);
          setCategoryToEdit(null);
        }}
        onSave={handleSaveCategory}
        categoryToEdit={categoryToEdit}
        parentCategories={categories}
      />

      {/* Product Editor Modal */}
      <ProductEditorModal
        isOpen={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        categories={categories}
      />

      {/* Comment Reply Modal */}
      <CommentReplyModal
        isOpen={commentReplyModalOpen}
        onClose={() => {
          setCommentReplyModalOpen(false);
          setCommentToReply(null);
        }}
        comment={commentToReply}
        onReply={handleReplyComment}
      />

      {/* Article Editor Modal */}
      <ArticleEditorModal
        isOpen={editorModalOpen}
        onClose={() => {
          setEditorModalOpen(false);
          setArticleToEdit(null);
        }}
        onSave={handleSaveArticle}
        articleToEdit={articleToEdit}
      />

      {/* Course Editor Modal */}
      <CourseEditorModal
        isOpen={courseModalOpen}
        onClose={() => {
          setCourseModalOpen(false);
          setCourseToEdit(null);
        }}
        onSave={handleSaveCourse}
        courseToEdit={courseToEdit}
      />

      {/* Order Detail & Inventory Commitment Modal */}
      <OrderDetailModal
        isOpen={orderDetailModalOpen}
        onClose={() => {
          setOrderDetailModalOpen(false);
          setOrderToView(null);
        }}
        order={orderToView}
        onUpdateStatus={handleUpdateOrderStatus}
      />

      {/* Contact Message Details & Reply Modal */}
      <ContactMessageModal
        isOpen={messageModalOpen}
        message={messageToView}
        onClose={() => {
          setMessageModalOpen(false);
          setMessageToView(null);
        }}
        onToggleRead={handleToggleMessageRead}
        onSaveReply={handleSaveMessageReply}
        onDelete={handleDeleteMessage}
      />
    </div>
  );
}
