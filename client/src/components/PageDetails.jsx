import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

const PageDetails = () => {
  const { pageId } = useParams();
  const [searchParams] = useSearchParams();
  const pageAccessToken = searchParams.get('pageAccessToken');
  const [pageDetails, setPageDetails] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [since, setSince] = useState('');
  const [until, setUntil] = useState('');

  useEffect(() => {
    const fetchPageDetails = async () => {
      try {
        const response = await fetch(
          `https://graph.facebook.com/${pageId}?fields=name,category,about,website,picture.width(720).height(720)&access_token=${pageAccessToken}`
        );
        const data = await response.json();
        setPageDetails(data);
      } catch (error) {
        console.error('Error fetching page details:', error);
      }
    };

    const fetchMetrics = async () => {
      try {
        const response = await fetch(
          `https://graph.facebook.com/${pageId}/insights?metric=page_fans,page_impressions,page_impressions_unique,page_post_engagements,post_engaged_users&access_token=${pageAccessToken}`
        );
        const data = await response.json();
        const metricsData = data.data.reduce((acc, metric) => {
          acc[metric.name] = acc[metric.name] || {};
          acc[metric.name][metric.period] = metric.values.map(value => ({
            value: value.value,
            end_time: value.end_time,
          }));
          return acc;
        }, {});
        setMetrics(metricsData);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    if (pageAccessToken) {
      fetchPageDetails();
      fetchMetrics();
    }
  }, [pageId, pageAccessToken]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'since') setSince(value);
    if (name === 'until') setUntil(value);
  };

  if (!pageDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.name}>{pageDetails.name}</h1>
      {pageDetails.picture && (
        <img
          src={pageDetails.picture.data.url}
          alt={`${pageDetails.name}'s profile`}
          style={styles.picture}
        />
      )}
      <div style={styles.datePicker}>
        <label>
          Since:
          <input type="date" name="since" value={since} onChange={handleDateChange} />
        </label>
        <label>
          Until:
          <input type="date" name="until" value={until} onChange={handleDateChange} />
        </label>
      </div>
      <div style={styles.detailsContainer}>
        <div style={styles.detail}>
          <strong>Category:</strong> {pageDetails.category}
        </div>
        {pageDetails.about && (
          <div style={styles.detail}>
            <strong>About:</strong> {pageDetails.about}
          </div>
        )}
        {pageDetails.website && (
          <div style={styles.detail}>
            <strong>Website:</strong>{' '}
            <a href={pageDetails.website} target="_blank" rel="noopener noreferrer">
              {pageDetails.website}
            </a>
          </div>
        )}
        <div style={styles.metricsContainer}>
          <div style={styles.metricCard}>
            <strong>Total Followers (Day):</strong>
            <div>Day: {metrics.page_fans?.day?.[0]?.value || 0}</div>
          </div>
          <div style={styles.metricCard}>
            <strong>Total Engagements:</strong>
            <div>Day: {metrics.page_post_engagements?.day?.[0]?.value || 0}</div>
            <div>Week: {metrics.page_post_engagements?.week?.[0]?.value || 0}</div>
            <div>28 Days: {metrics.page_post_engagements?.days_28?.[0]?.value || 0}</div>
          </div>
          <div style={styles.metricCard}>
            <strong>Total Impressions:</strong>
            <div>Day: {metrics.page_impressions?.day?.[0]?.value || 0}</div>
            <div>Week: {metrics.page_impressions?.week?.[0]?.value || 0}</div>
            <div>28 Days: {metrics.page_impressions?.days_28?.[0]?.value || 0}</div>
          </div>
          <div style={styles.metricCard}>
            <strong>Total Reach:</strong>
            <div>Day: {metrics.page_impressions_unique?.day?.[0]?.value || 0}</div>
            <div>Week: {metrics.page_impressions_unique?.week?.[0]?.value || 0}</div>
            <div>28 Days: {metrics.page_impressions_unique?.days_28?.[0]?.value || 0}</div>
          </div>
          <div style={styles.metricCard}>
            <strong>Total Reactions (Lifetime):</strong>
            <div>Lifetime: {metrics.post_engaged_users?.lifetime?.[0]?.value || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  },
  name: {
    fontSize: '2em',
    marginBottom: '20px',
    textAlign: 'center',
  },
  picture: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    marginBottom: '20px',
    objectFit: 'cover',
  },
  datePicker: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  detail: {
    marginBottom: '10px',
    textAlign: 'center',
    fontSize: '1em',
  },
  metricsContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  },
  metricCard: {
    marginBottom: '10px',
    textAlign: 'center',
    fontSize: '1em',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
};

export default PageDetails;
