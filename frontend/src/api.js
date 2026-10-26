import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from './api';

const emptyForm = {
  courseId: '',
  courseName: '',
  courseDuration: '',
  comments: '',
  rating: '5'
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.request('/feedback');
      setFeedbackList(response.data || []);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load feedback data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleDelete = async (entry) => {
    const confirmed = window.confirm(`Delete feedback for ${entry.courseName}?`);
    if (!confirmed) return;

    try {
      await api.request(`/feedback/${entry._id}`, { method: 'DELETE' });
      await fetchFeedback();
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete feedback.');
    }
  };

  if (loading) {
    return (
      <section className="page-panel">
        <div className="state-card">
          <h2>Loading feedback</h2>
          <p>Fetching course feedback data...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page-panel">
        <div className="state-card error-card">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button type="button" className="primary-button" onClick={fetchFeedback}>Retry</button>
        </div>
      </section>
    );
  }

  if (!feedbackList.length) {
    return (
      <section className="page-panel">
        <div className="state-card empty-card">
          <h2>No feedback yet</h2>
          <p>Start by adding the first course feedback entry.</p>
          <button type="button" className="primary-button" onClick={() => navigate('/add')}>
            Add Feedback
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Course Feedback Dashboard</h2>
        </div>
      </div>

      <div className="feedback-grid">
        {feedbackList.map((entry) => (
          <article key={entry._id} className="feedback-card">
            <div className="card-header">
              <span className="chip">Course #{entry.courseId}</span>
              <span className="rating-badge">{entry.rating}/5</span>
            </div>

            <h3>{entry.courseName}</h3>

            <div className="meta-list">
              <div>
                <span className="label">Course ID</span>
                <strong>{entry.courseId}</strong>
              </div>
              <div>
                <span className="label">Duration</span>
                <strong>{entry.courseDuration}</strong>
              </div>
              <div>
                <span className="label">Overall Feedback Rating</span>
                <strong>{entry.rating} / 5</strong>
              </div>
            </div>

            <div className="comments-block">
              <span className="label">Comments</span>
              <p>{entry.comments}</p>
            </div>

            <div className="action-row">
              <button type="button" className="secondary-button" onClick={() => navigate('/add', { state: { feedback: entry } })}>
                Update
              </button>
              <button type="button" className="danger-button" onClick={() => handleDelete(entry)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const FeedbackFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingFeedback = location.state?.feedback || null;

  const [formData, setFormData] = useState(
    editingFeedback
      ? {
          courseId: editingFeedback.courseId || '',
          courseName: editingFeedback.courseName || '',
          courseDuration: editingFeedback.courseDuration || '',
          comments: editingFeedback.comments || '',
          rating: String(editingFeedback.rating || 5)
        }
      : emptyForm
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingFeedback) {
      setFormData({
        courseId: editingFeedback.courseId || '',
        courseName: editingFeedback.courseName || '',
        courseDuration: editingFeedback.courseDuration || '',
        comments: editingFeedback.comments || '',
        rating: String(editingFeedback.rating || 5)
      });
    } else {
      setFormData(emptyForm);
    }
  }, [editingFeedback]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      courseId: formData.courseId.trim(),
      courseName: formData.courseName.trim(),
      courseDuration: formData.courseDuration.trim(),
      comments: formData.comments.trim(),
      rating: Number(formData.rating)
    };

    try {
      if (!payload.courseId || !payload.courseName || !payload.courseDuration || !payload.comments || Number.isNaN(payload.rating)) {
        throw new Error('Please fill in all required fields before submitting.');
      }

      if (payload.rating < 1 || payload.rating > 5) {
        throw new Error('Rating must be between 1 and 5.');
      }

      const endpoint = editingFeedback ? `/feedback/${editingFeedback._id}` : '/feedback';
      const method = editingFeedback ? 'PUT' : 'POST';

      await api.request(endpoint, {
        method,
        body: JSON.stringify(payload)
      });

      navigate('/');
    } catch (submitError) {
      setError(submitError.message || 'Unable to save feedback.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{editingFeedback ? 'Edit' : 'Create'}</p>
          <h2>{editingFeedback ? 'Update feedback entry' : 'Add feedback entry'}</h2>
        </div>
      </div>

      <form className="feedback-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            <span>Course ID</span>
            <input
              type="text"
              name="courseId"
              placeholder="e.g. CS101"
              value={formData.courseId}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Course Name</span>
            <input
              type="text"
              name="courseName"
              placeholder="e.g. Intro to Web Development"
              value={formData.courseName}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Course Duration</span>
            <input
              type="text"
              name="courseDuration"
              placeholder="e.g. 8 weeks"
              value={formData.courseDuration}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            <span>Feedback Rating</span>
            <select name="rating" value={formData.rating} onChange={handleChange} required>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </label>
        </div>

        <label>
          <span>Feedback Comments</span>
          <textarea
            name="comments"
            placeholder="Share your experience, key takeaways, and suggestions..."
            rows="5"
            value={formData.comments}
            onChange={handleChange}
            required
          />
        </label>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? (editingFeedback ? 'Updating...' : 'Saving...') : (editingFeedback ? 'Update Feedback' : 'Add Feedback')}
          </button>
        </div>
      </form>
    </section>
  );
};

const AppLayout = () => {
  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/add', label: 'Add Feedback' }
  ];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container nav-bar">
          <div className="brand">
            <span className="brand-mark">CF</span>
            <div>
              <strong>Course Feedback</strong>
              <small>Admin Panel</small>
            </div>
          </div>

          <nav className="main-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="container page-layout">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/add" element={<FeedbackFormPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
