import numpy as np
import json


def get_embedding(text):

    vector = [ord(c) % 50 for c in text][:20]

    if len(vector) < 20:
        vector += [0] * (20 - len(vector))

    return vector


def cosine_similarity(v1, v2):

    a = np.array(v1)
    b = np.array(v2)

    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))


def serialize_embedding(e):
    return json.dumps(e)


def deserialize_embedding(e):
    return json.loads(e)