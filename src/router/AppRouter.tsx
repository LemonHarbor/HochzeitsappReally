import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

// Lazy load pages to improve initial load performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const GuestManagementPage = lazy(() => import('./pages/guest-management'));
const BudgetPlanningPage = lazy(() => import('./pages/budget-planning'));
const VendorManagementPage = lazy(() => import('./pages/vendor-management'));
const SeatingPlannerPage = lazy(() => import('./pages/seating-planner'));
const PhotoGalleryPage = lazy(() => import('./pages/photo-gallery'));

// JGA Planning Module Pages
const JGADashboardPage = lazy(() => import('./pages/jga/JGADashboard'));
const JGADatePollPage = lazy(() => import('./pages/jga/JGADatePollPage'));
const JGABudgetPage = lazy(() => import('./pages/jga/JGABudgetPage'));
const JGAActivitiesPage = lazy(() => import('./pages/jga/JGAActivitiesPage'));
const JGATasksPage = lazy(() => import('./pages/jga/JGATasksPage'));
const JGASurpriseIdeasPage = lazy(() => import('./pages/jga/JGASurpriseIdeasPage'));
const JGAInvitationsPage = lazy(() => import('./pages/jga/JGAInvitationsPage'));
const JGAPhotoGalleryPage = lazy(() => import('./pages/jga/JGAPhotoGalleryPage'));

// Wedding Homepage Pages
const WeddingHomepageDashboard = lazy(() => import('./pages/wedding-homepage/WeddingHomepageDashboard'));
const WeddingHomepageDesignPage = lazy(() => import('./pages/wedding-homepage/WeddingHomepageDesignPage'));
const WeddingHomepageContentPage = lazy(() => import('./pages/wedding-homepage/WeddingHomepageContentPage'));
const WeddingHomepageRSVPPage = lazy(() => import('./pages/wedding-homepage/WeddingHomepageRSVPPage'));
const WeddingHomepageGiftRegistryPage = lazy(() => import('./pages/wedding-homepage/WeddingHomepageGiftRegistryPage'));
const WeddingHomepageGuestbookPage = lazy(() => import('./pages/wedding-homepage/WeddingHomepageGuestbookPage'));
const WeddingHomepageAccommodationPage = lazy(() => import('./pages/wedding-homepage/WeddingHomepageAccommodationPage'));
const WeddingHomepageFAQPage = lazy(() => import('./pages/wedding-homepage/WeddingHomepageFAQPage'));
const WeddingHomepagePreviewPage = lazy(() => import('./pages/wedding-homepage/WeddingHomepagePreviewPage'));

// Testing Pages
const TestingDashboard = lazy(() => import('./pages/testing/TestingDashboard'));

// Create router configuration
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { 
        path: 'dashboard', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'guests', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <GuestManagementPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'budget', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <BudgetPlanningPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'vendors', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <VendorManagementPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'seating', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <SeatingPlannerPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'photos', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <PhotoGalleryPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      
      // JGA Planning Module Routes
      { 
        path: 'jga', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <JGADashboardPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'jga/date-poll', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <JGADatePollPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'jga/budget', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <JGABudgetPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'jga/activities', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <JGAActivitiesPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'jga/tasks', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <JGATasksPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'jga/surprise-ideas', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <JGASurpriseIdeasPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'jga/invitations', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <JGAInvitationsPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'jga/photos', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <JGAPhotoGalleryPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      
      // Wedding Homepage Routes
      { 
        path: 'wedding-homepage', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <WeddingHomepageDashboard />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'wedding-homepage/design', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <WeddingHomepageDesignPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'wedding-homepage/content', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <WeddingHomepageContentPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'wedding-homepage/rsvp', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <WeddingHomepageRSVPPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'wedding-homepage/gift-registry', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <WeddingHomepageGiftRegistryPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'wedding-homepage/guestbook', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <WeddingHomepageGuestbookPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'wedding-homepage/accommodation', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <WeddingHomepageAccommodationPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'wedding-homepage/faq', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <WeddingHomepageFAQPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'wedding-homepage/preview', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <WeddingHomepagePreviewPage />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      
      // Testing Routes
      { 
        path: 'testing', 
        element: (
          <ProtectedRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <TestingDashboard />
            </Suspense>
          </ProtectedRoute>
        ) 
      },
      
      // 404 Route
      { path: '*', element: <NotFoundPage /> }
    ]
  }
]);

// Router component
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
