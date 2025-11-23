import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Navbar, Nav, Table, Badge, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { linkService } from '../services/linkService';
import type { Link } from '../types';

interface LinkAnalytics {
    link: {
        id: number;
        shortCode: string;
        targetUrl: string;
        totalClicks: number;
    };
    analytics: {
        totalClicks: number;
        uniqueVisitors: number;
        browserStats: { [key: string]: number };
        osStats: { [key: string]: number };
        countryStats: { [key: string]: number };
        recentClicks: any[];
    };
}

export default function Analytics() {
    const [links, setLinks] = useState<Link[]>([]);
    const [selectedLink, setSelectedLink] = useState<number | null>(null);
    const [analytics, setAnalytics] = useState<LinkAnalytics | null>(null);
    const [totalLinks, setTotalLinks] = useState(0);
    const [totalClicks, setTotalClicks] = useState(0);
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const data = await linkService.getAll();
            setLinks(data.links);
            setTotalLinks(data.links.length);
            setTotalClicks(data.links.reduce((sum, link) => sum + link.totalClicks, 0));
        } catch (err) {
            console.error('Error fetching links:', err);
        }
    };

    const fetchAnalytics = async (linkId: number) => {
        try {
            const data = await linkService.getAnalytics(linkId);
            setAnalytics(data);
            setSelectedLink(linkId);
        } catch (err) {
            console.error('Error fetching analytics:', err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
                <Container>
                    <Navbar.Brand onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>TinyLink</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Nav>
                            <Nav.Link onClick={() => navigate('/dashboard')}>Dashboard</Nav.Link>
                            <Nav.Link onClick={() => navigate('/analytics')}>Analytics</Nav.Link>
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container>
                <Row className="mb-4">
                    <Col>
                        <h2 className="fw-bold">Analytics Dashboard</h2>
                        <p className="text-muted">Track your link performance and visitor insights</p>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col md={4} className="mb-3">
                        <Card className="shadow-sm text-center">
                            <Card.Body className="p-4">
                                <h3 className="text-primary display-5 fw-bold">{totalLinks}</h3>
                                <p className="text-muted mb-0">Total Links</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="shadow-sm text-center">
                            <Card.Body className="p-4">
                                <h3 className="text-success display-5 fw-bold">{totalClicks}</h3>
                                <p className="text-muted mb-0">Total Clicks</p>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                        <Card className="shadow-sm text-center">
                            <Card.Body className="p-4">
                                <h3 className="text-info display-5 fw-bold">
                                    {totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : 0}
                                </h3>
                                <p className="text-muted mb-0">Avg Clicks/Link</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col lg={5} className="mb-4">
                        <Card className="shadow-sm">
                            <Card.Body>
                                <h5 className="mb-3">Your Links</h5>
                                {links.length === 0 ? (
                                    <p className="text-muted text-center py-3">No links yet</p>
                                ) : (
                                    <ListGroup variant="flush">
                                        {links.map((link) => (
                                            <ListGroup.Item
                                                key={link.id}
                                                action
                                                active={selectedLink === link.id}
                                                onClick={() => fetchAnalytics(link.id)}
                                                className="d-flex justify-content-between align-items-center"
                                            >
                                                <div>
                                                    <div className="fw-semibold">{link.shortCode}</div>
                                                    <small className="text-muted text-truncate d-block" style={{ maxWidth: '250px' }}>
                                                        {link.targetUrl}
                                                    </small>
                                                </div>
                                                <Badge bg="primary" pill>{link.totalClicks}</Badge>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={7}>
                        {!analytics ? (
                            <Card className="shadow-sm">
                                <Card.Body className="text-center py-5">
                                    <p className="text-muted">Select a link to view detailed analytics</p>
                                </Card.Body>
                            </Card>
                        ) : (
                            <>
                                <Card className="shadow-sm mb-4">
                                    <Card.Body>
                                        <h5 className="mb-3">Link Details</h5>
                                        <p><strong>Short Code:</strong> {analytics.link.shortCode}</p>
                                        <p><strong>Target URL:</strong> <a href={analytics.link.targetUrl} target="_blank" rel="noopener noreferrer">{analytics.link.targetUrl}</a></p>
                                        <Row className="mt-3">
                                            <Col xs={6}>
                                                <div className="text-center p-3 bg-light rounded">
                                                    <h4 className="text-primary mb-0">{analytics.analytics.totalClicks}</h4>
                                                    <small className="text-muted">Total Clicks</small>
                                                </div>
                                            </Col>
                                            <Col xs={6}>
                                                <div className="text-center p-3 bg-light rounded">
                                                    <h4 className="text-success mb-0">{analytics.analytics.uniqueVisitors}</h4>
                                                    <small className="text-muted">Unique Visitors</small>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                <Row>
                                    <Col md={6} className="mb-4">
                                        <Card className="shadow-sm h-100">
                                            <Card.Body>
                                                <h6 className="mb-3">Browser Stats</h6>
                                                {Object.keys(analytics.analytics.browserStats).length === 0 ? (
                                                    <p className="text-muted small">No data yet</p>
                                                ) : (
                                                    <Table size="sm" hover>
                                                        <tbody>
                                                            {Object.entries(analytics.analytics.browserStats)
                                                                .sort(([, a], [, b]) => b - a)
                                                                .map(([browser, count]) => (
                                                                    <tr key={browser}>
                                                                        <td>{browser || 'Unknown'}</td>
                                                                        <td className="text-end">
                                                                            <Badge bg="info">{count}</Badge>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                        </tbody>
                                                    </Table>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col md={6} className="mb-4">
                                        <Card className="shadow-sm h-100">
                                            <Card.Body>
                                                <h6 className="mb-3">Operating System</h6>
                                                {Object.keys(analytics.analytics.osStats).length === 0 ? (
                                                    <p className="text-muted small">No data yet</p>
                                                ) : (
                                                    <Table size="sm" hover>
                                                        <tbody>
                                                            {Object.entries(analytics.analytics.osStats)
                                                                .sort(([, a], [, b]) => b - a)
                                                                .map(([os, count]) => (
                                                                    <tr key={os}>
                                                                        <td>{os || 'Unknown'}</td>
                                                                        <td className="text-end">
                                                                            <Badge bg="success">{count}</Badge>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                        </tbody>
                                                    </Table>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <Card className="shadow-sm mb-4">
                                    <Card.Body>
                                        <h6 className="mb-3">Geographic Distribution</h6>
                                        {Object.keys(analytics.analytics.countryStats).length === 0 ? (
                                            <p className="text-muted small">No data yet</p>
                                        ) : (
                                            <Table size="sm" hover>
                                                <thead>
                                                    <tr>
                                                        <th>Country</th>
                                                        <th className="text-end">Visits</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(analytics.analytics.countryStats)
                                                        .sort(([, a], [, b]) => b - a)
                                                        .map(([country, count]) => (
                                                            <tr key={country}>
                                                                <td>{country || 'Unknown'}</td>
                                                                <td className="text-end">
                                                                    <Badge bg="warning" text="dark">{count}</Badge>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                </tbody>
                                            </Table>
                                        )}
                                    </Card.Body>
                                </Card>

                                <Card className="shadow-sm">
                                    <Card.Body>
                                        <h6 className="mb-3">Recent Clicks</h6>
                                        {analytics.analytics.recentClicks.length === 0 ? (
                                            <p className="text-muted small">No clicks yet</p>
                                        ) : (
                                            <Table size="sm" hover responsive>
                                                <thead>
                                                    <tr>
                                                        <th>Time</th>
                                                        <th>Browser</th>
                                                        <th>OS</th>
                                                        <th>Location</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {analytics.analytics.recentClicks.map((click, idx) => (
                                                        <tr key={idx}>
                                                            <td>{new Date(click.clickedAt).toLocaleString()}</td>
                                                            <td>{click.browser || '-'}</td>
                                                            <td>{click.os || '-'}</td>
                                                            <td>{click.city ? `${click.city}, ${click.country}` : click.country || '-'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        )}
                                    </Card.Body>
                                </Card>
                            </>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    );
}
