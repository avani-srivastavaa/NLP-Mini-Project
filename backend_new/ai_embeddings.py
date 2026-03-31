import numpy as np


def get_embedding(text):
    return np.random.rand(10)  # dummy embedding


def cosine_similarity(a, b):
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))


def serialize_embedding(embedding):
    return ",".join(map(str, embedding))


def deserialize_embedding(embedding_str):
    return np.array(list(map(float, embedding_str.split(","))))