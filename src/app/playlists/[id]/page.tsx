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

export default function PlaylistIdPage({ params }: { params: { id: string } }) {
  const [videos, setVideos] = useState([]);
  const [playlist, setPlaylist] = useState<Playlist>();
  const [vLoading, setVLoading] = useState(true);
  const [pLoading, setPLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState<string>("");

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
      let found = false;
      for (const item in json) {
        if (json[item].id === parseInt(params.id)) {
          setPlaylist(json[item]);
          found = true;
          break;
        }
      }
      if (!found) {
        throw new Error("Failed to find playlist");
      }
      setPLoading(false);
    };
    fetchVideos();
    fetchPlaylists();
  }, []);

  const handleModalClose = () => setModal(false);
  const handleModalOpen = () => setModal(true);

  const handleAddVideoToPlaylist = (id: number) => {
    // TODO: API call to add to DB and perform checks
    console.log("Adding video id: " + id);
    const button = document.getElementById("button-add-" + id);
    if (button) {
      button.textContent = "Done!";
      button.classList.add("btn-warning");
      button.classList.remove("btn-secondary");
    }
  };

  const handleDeleteVideoFromPlaylist = (id: number) => {
    // TODO: API call to remove from DB and perform checks
    console.log("Deleting video id: " + id);
    const button = document.getElementById("button-remove-" + id);
    if (button) {
      button.textContent = "Removed!";
      button.classList.add("btn-danger");
      button.classList.remove("btn-secondary");
    }
  };

  // Basic regex search, could be computationally expensive if lots of videos
  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSearch(event.target.value);
  };

  /* 
    TODO: Add pagination, separate into reusable components, change
    remove buttons into a burger dropdown icon
  */

  return (
    <>
      {(vLoading || pLoading) && <Spinner />}
      {!vLoading && !pLoading && (
        <Container style={{ marginBottom: "2rem", padding: "0" }}>
          <h1>{playlist?.name}</h1>
          <h3>{playlist?.description}</h3>
          <Button variant="warning" onClick={handleModalOpen} className="mt-2">
            Add to playlist
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
              <Col sm={1}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    handleDeleteVideoFromPlaylist(item.id);
                  }}
                  id={"button-remove-" + item.id}
                  className="mb-4"
                >
                  Remove
                </Button>
              </Col>
            </Row>
          );
        }
      })}

      <Modal show={modal} onHide={handleModalClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Add a video</Modal.Title>
        </Modal.Header>
        <Container className="pt-3">
          <Form.Control
            type="text"
            placeholder="Search a video"
            value={search}
            onChange={(e) => {
              handleSearch(e);
            }}
          />
        </Container>
        <Modal.Body>
          <Container>
            {videos.map((item: Video, idx) => {
              if (
                !playlist?.videoIds.includes(item.id) &&
                item.name.toLowerCase().match(search.toLowerCase())
              ) {
                return (
                  <Row key={idx} className="mb-2">
                    <Col>
                      <h5>{item.name}</h5>
                    </Col>
                    <Col xs={2}>
                      <Button
                        variant="secondary"
                        id={"button-add-" + item.id}
                        onClick={() => {
                          handleAddVideoToPlaylist(item.id);
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
