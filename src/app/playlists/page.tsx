"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { GET } from "@/app/api/playlists/route";
import { PlaylistItem } from "@/components/playlist-item";
import { Playlist } from "@/interfaces/playlist";
import Link from "next/link";
import { Button, Container, Form, Modal, Spinner } from "react-bootstrap";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchPlaylists = async () => {
      const res = await GET();
      const json = await res.json();
      setPlaylists(json);
      setLoading(false);
    };
    fetchPlaylists();
  }, []);

  const handleModalClose = () => setModal(false);
  const handleModalOpen = () => setModal(true);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // API for playlist creation
    console.log(formData);
    handleModalClose();
  };

  // TODO: Add dropdowns for playlists

  return (
    <>
      <h1>Playlists</h1>
      {loading && <Spinner />}
      {!loading && (
        <Container style={{ marginBottom: "2rem", padding: "0" }}>
          <Button variant="warning" onClick={handleModalOpen} className="mt-2">
            Create a playlist
          </Button>
        </Container>
      )}

      {playlists.map((item: Playlist, idx) => {
        return (
          <Container key={idx}>
            <Link
              href={"/playlists/" + item.id}
              className="link-underline link-underline-opacity-0 text-black"
            >
              <PlaylistItem playlist={item} />
            </Link>
          </Container>
        );
      })}

      <Modal show={modal} onHide={handleModalClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Create a new playlist</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Playlist Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Name"
                name="name"
                autoFocus
                value={formData.name}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleFormChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button type="submit" variant="warning">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
