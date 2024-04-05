"use client";
import { GET as GetVideos } from "@/app/api/videos/route";
import { GET as GetPlaylists } from "@/app/api/playlists/route";
import React, { useEffect, useState } from "react";
import VideoItem from "@/components/video-item";
import { Playlist } from "@/interfaces/playlist";
import { Video } from "@/interfaces/video";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import Document from "next/document";

export default function PlaylistIdPage({ params }: { params: { id: string } }) {
  const [videos, setVideos] = useState([]);
  const [playlist, setPlaylist] = useState<Playlist>();
  const [vLoading, setVLoading] = useState(true);
  const [pLoading, setPLoading] = useState(true);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await GetVideos();
      const json = await res.json();
      setVideos(json);
      setVLoading(false);
    };
    const fetchPlaylists = async () => {
      const res = await GetPlaylists();
      const json = await res.json();
      for (const item in json) {
        if (json[item].id === parseInt(params.id)) {
          setPlaylist(json[item]);
          break;
        }
      }
      setPLoading(false);
    };
    fetchVideos();
    fetchPlaylists();
  }, []);

  const handleModalClose = () => setModal(false);
  const handleModalOpen = () => setModal(true);
  const handleAdd = (id: number) => {
    // TODO: API call to add to DB and perform checks
    console.log("Adding video id: " + id);
    const button = document.getElementById("button-add-" + id);
    if (button) {
      button.textContent = "Done!";
      button.classList.add("btn-warning");
      button.classList.remove("btn-secondary");
    }
  };

  const handleDelete = (id: number) => {
    // TODO: API call to remove from DB and perform checks
    console.log("Deleting video id: " + id);
    const button = document.getElementById("button-remove-" + id);
    if (button) {
      button.textContent = "Removed!";
      button.classList.add("btn-danger");
      button.classList.remove("btn-secondary");
    }
  };

  /* 
    TODO: Implement search, add pagination, separate into reusable components, change
    remove button into a burger dropdown icon
  */

  return (
    <>
      {(vLoading || pLoading) && <Spinner />}
      {!vLoading && !pLoading && (
        <Container style={{ marginBottom: "2rem", padding: "0" }}>
          <h1>{playlist?.name}</h1>
          <h3>{playlist?.description}</h3>
          <Button variant="warning" onClick={handleModalOpen} className="mt-2">
            Add a video
          </Button>
        </Container>
      )}

      {videos.map((item: Video, idx) => {
        if (playlist?.videoIds.includes(item.id)) {
          return (
            <Row key={idx}>
              <Col>
                <VideoItem video={item} />
              </Col>
              <Col xs={1}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleDelete(item.id);
                  }}
                  id={"button-remove-" + item.id}
                >
                  Remove
                </Button>
              </Col>
            </Row>
          );
        }
      })}

      <Modal show={modal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a video</Modal.Title>
        </Modal.Header>
        <Container className="pt-3">
          <Form.Control type="text" placeholder="Search a video" />
        </Container>
        <Modal.Body>
          <Container>
            {videos.map((item: Video, idx) => {
              if (!playlist?.videoIds.includes(item.id)) {
                return (
                  <Row key={idx} className="mb-2">
                    <Col>
                      <h4>{item.name}</h4>
                    </Col>
                    <Col xs={2}>
                      <Button
                        variant="secondary"
                        id={"button-add-" + item.id}
                        onClick={() => {
                          handleAdd(item.id);
                        }}
                      >
                        Add
                      </Button>
                    </Col>
                  </Row>
                );
              }
            })}
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}
