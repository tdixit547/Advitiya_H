'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import LinkButton from '@/components/LinkButton';

interface FilteredLink {
  variant_id: string;
  target_url: string;
  title: string;
  description?: string;
  icon?: string;
  priority: number;
  score: number;
}

interface HubProfile {
  username: string;
  avatar: string | null;
  bio: string;
  slug: string;
  theme: {
    bg: string;
    accent: string;
  };
}

interface HubData {
  profile: HubProfile;
  links: FilteredLink[];
  context: {
    device: string;
    country: string;
    timestamp: string;
  };
}

/**
 * Public Hub Page
 * Displays the user's link hub profile with filtered links
 */
export default function HubPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [hubData, setHubData] = useState<HubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHubData() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/${slug}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) {
          if (res.status === 404) {
            setError('Hub not found');
          } else {
            setError('Failed to load hub');
          }
          return;
        }

        const data = await res.json();
        setHubData(data);
      } catch (err) {
        console.error('Error fetching hub:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchHubData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Fira Code', 'Courier New', monospace",
        }}
      >
        <div style={{ color: '#00FF00', textAlign: 'center' }}>
          <div
            style={{
              fontSize: '1.5rem',
              marginBottom: '16px',
              textShadow: '0 0 10px #00FF00',
            }}
          >
            [ LOADING... ]
          </div>
          <div style={{ opacity: 0.7 }}>Initializing connection</div>
        </div>
      </div>
    );
  }

  if (error || !hubData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Fira Code', 'Courier New', monospace",
        }}
      >
        <div style={{ color: '#FF0000', textAlign: 'center' }}>
          <div
            style={{
              fontSize: '2rem',
              marginBottom: '16px',
              textShadow: '0 0 10px #FF0000',
            }}
          >
            [ ERROR ]
          </div>
          <div style={{ opacity: 0.8 }}>{error || 'Unknown error'}</div>
          <a
            href="/"
            style={{
              display: 'inline-block',
              marginTop: '24px',
              color: '#00FF00',
              textDecoration: 'underline',
            }}
          >
            → Return to home
          </a>
        </div>
      </div>
    );
  }

  const { profile, links } = hubData;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        fontFamily: "'Fira Code', 'Courier New', monospace",
        padding: '40px 20px',
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          margin: '0 auto',
        }}
      >
        {/* Profile Header */}
        <header style={{ textAlign: 'center', marginBottom: '48px' }}>
          {/* Avatar */}
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.username}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '3px solid #00FF00',
                margin: '0 auto 16px',
                boxShadow: '0 0 30px rgba(0, 255, 0, 0.4)',
              }}
            />
          ) : (
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '3px solid #00FF00',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0a0a0a',
                fontSize: '3rem',
                color: '#00FF00',
                textShadow: '0 0 20px #00FF00',
              }}
            >
              {profile.username.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Username */}
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#00FF00',
              margin: '0 0 8px 0',
              textShadow: '0 0 10px #00FF00, 0 0 20px #00FF00',
            }}
          >
            @{profile.username}
          </h1>

          {/* Bio */}
          {profile.bio && (
            <p
              style={{
                color: '#00CC00',
                fontSize: '1rem',
                margin: 0,
                opacity: 0.9,
              }}
            >
              {profile.bio}
            </p>
          )}
        </header>

        {/* Link List */}
        <main>
          {links.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                color: '#00FF00',
                opacity: 0.7,
                padding: '40px',
                border: '2px dashed #00FF00',
                borderRadius: '8px',
              }}
            >
              [ No links available for your context ]
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {links.map((link) => (
                <LinkButton
                  key={link.variant_id}
                  variantId={link.variant_id}
                  hubId={profile.slug}
                  title={link.title}
                  targetUrl={link.target_url}
                  description={link.description}
                  icon={link.icon}
                />
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer
          style={{
            marginTop: '48px',
            textAlign: 'center',
            color: '#00FF00',
            opacity: 0.5,
            fontSize: '0.75rem',
          }}
        >
          <p>Powered by Smart Link Hub</p>
          <p style={{ marginTop: '4px' }}>
            [ {hubData.context.device.toUpperCase()} | {hubData.context.country} ]
          </p>
        </footer>
      </div>
    </div>
  );
}
