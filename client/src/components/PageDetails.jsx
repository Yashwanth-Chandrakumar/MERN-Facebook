import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import './page.css'; // Make sure to create this CSS file

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
        let url = `https://graph.facebook.com/${pageId}/insights?metric=page_fans,page_impressions,page_impressions_unique,page_post_engagements,post_engaged_users&access_token=${pageAccessToken}`;
        if (since && until) {
          url += `&since=${Math.floor(new Date(since).getTime() / 1000)}&until=${Math.floor(new Date(until).getTime() / 1000)}`;
        }
        const response = await fetch(url);
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
        console.log(metricsData);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    if (pageAccessToken) {
      fetchPageDetails();
      fetchMetrics();
    }
  }, [pageId, pageAccessToken, since, until]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'since') setSince(value);
    if (name === 'until') setUntil(value);
  };
  if (!pageDetails) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-details-container">
      <header className="page-header">
        {pageDetails.picture && (
          <img
            src={pageDetails.picture.data.url}
            alt={`${pageDetails.name}'s profile`}
            className="page-picture"
          />
        )}
        <h1 className="page-name">{pageDetails.name}</h1>
      </header>

      <div className="date-picker">
        <label>
          Since:
          <input type="date" name="since" value={since} onChange={handleDateChange} />
        </label>
        <label>
          Until:
          <input type="date" name="until" value={until} onChange={handleDateChange} />
        </label>
      </div>

      <div className="page-info">
        <div className="info-item">
          <strong>Category:</strong> {pageDetails.category}
        </div>
        {pageDetails.about && (
          <div className="info-item">
            <strong>About:</strong> {pageDetails.about}
          </div>
        )}
        {pageDetails.website && (
          <div className="info-item">
            <strong>Website:</strong>{' '}
            <a href={pageDetails.website} target="_blank" rel="noopener noreferrer">
              {pageDetails.website}
            </a>
          </div>
        )}
      </div>

      <div className="metrics-container">
        <div className="metric-card">
          <h3>Total Followers</h3>
          <div className="metric-value">Day: {metrics.page_fans?.day?.[0]?.value || 0}</div>
        </div>
        <div className="metric-card">
          <h3>Total Engagements</h3>
          <div className="metric-value">Day: {metrics.page_post_engagements?.day?.[0]?.value || 0}</div>
          <div className="metric-value">Week: {metrics.page_post_engagements?.week?.[0]?.value || 0}</div>
          <div className="metric-value">28 Days: {metrics.page_post_engagements?.days_28?.[0]?.value || 0}</div>
        </div>
        <div className="metric-card">
          <h3>Total Impressions</h3>
          <div className="metric-value">Day: {metrics.page_impressions?.day?.[0]?.value || 0}</div>
          <div className="metric-value">Week: {metrics.page_impressions?.week?.[0]?.value || 0}</div>
          <div className="metric-value">28 Days: {metrics.page_impressions?.days_28?.[0]?.value || 0}</div>
        </div>
        <div className="metric-card">
          <h3>Total Reach</h3>
          <div className="metric-value">Day: {metrics.page_impressions_unique?.day?.[0]?.value || 0}</div>
          <div className="metric-value">Week: {metrics.page_impressions_unique?.week?.[0]?.value || 0}</div>
          <div className="metric-value">28 Days: {metrics.page_impressions_unique?.days_28?.[0]?.value || 0}</div>
        </div>
        <div className="metric-card">
          <h3>Total Reactions (Lifetime)</h3>
          <div className="metric-value">Lifetime: {metrics.post_engaged_users?.lifetime?.[0]?.value || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default PageDetails;