import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Navbar, Nav } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { linkService } from '../services/linkService';
import type { Link as LinkType } from '../types';

export default function Dashboard() {
    const [targetUrl, setTargetUrl] = useState('');
    const [links, setLinks] = useState<LinkType[]>([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const data = await linkService.getAll();
            setLinks(data.links);
        } catch (err) {
            console.error('Error fetching links:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await linkService.create(targetUrl);
            setSuccess('Short link created successfully!');
            setTargetUrl('');
            fetchLinks();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create link');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this link?')) return;

        try {
            await linkService.delete(id);
            setSuccess('Link deleted successfully');
            fetchLinks();
        } catch (err) {
            setError('Failed to delete link');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setSuccess('Link copied to clipboard!');
        setTimeout(() => setSuccess(''), 3000);
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
                        <h2 className="fw-bold">Welcome, {user?.name || 'User'}!</h2>
                        <p className="text-muted">Create and manage your short links</p>
                    </Col>
                </Row>

                {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
                {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

                <Row className="mb-4">
                    <Col lg={8} className="mx-auto">
                        <Card className="shadow-sm">
                            <Card.Body className="p-4">
                                <h5 className="mb-3">Create New Short Link</h5>
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Enter URL to shorten</Form.Label>
                                        <Form.Control
                                            type="url"
                                            placeholder="https://example.com/your-long-url"
                                            value={targetUrl}
                                            onChange={(e) => setTargetUrl(e.target.value)}
                                            required
                                            size="lg"
                                        />
                                    </Form.Group>
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        disabled={loading}
                                        className="w-100"
                                    >
                                        {loading ? 'Creating...' : 'Shorten URL'}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col lg={10} className="mx-auto">
                        <Card className="shadow-sm">
                            <Card.Body>
                                <h5 className="mb-3">Your Links ({links.length})</h5>
                                {links.length === 0 ? (
                                    <p className="text-muted text-center py-4">No links yet. Create your first short link above!</p>
                                ) : (
                                    <Table responsive hover>
                                        <thead>
                                            <tr>
                                                <th>Short URL</th>
                                                <th>Target URL</th>
                                                <th>Clicks</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {links.map((link) => (
                                                <tr key={link.id}>
                                                    <td>
                                                        <a href={link.shortUrl} target="_blank" rel="noopener noreferrer">
                                                            {link.shortCode}
                                                        </a>
                                                    </td>
                                                    <td className="text-truncate" style={{ maxWidth: '300px' }}>
                                                        {link.targetUrl}
                                                    </td>
                                                    <td>{link.totalClicks}</td>
                                                    <td>{new Date(link.createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <Button 
                                                            variant="outline-primary" 
                                                            size="sm" 
                                                            className="me-2"
                                                            onClick={() => copyToClipboard(link.shortUrl)}
                                                        >
                                                            Copy
                                                        </Button>
                                                        <Button 
                                                            variant="outline-danger" 
                                                            size="sm"
                                                            onClick={() => handleDelete(link.id)}
                                                        >
                                                            Delete
                                                        </Button>
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
            </Container>
        </>
    );
}
