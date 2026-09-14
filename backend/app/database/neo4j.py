import logging
from typing import Any, Dict, List, Optional
from neo4j import GraphDatabase, Driver
from app.config import settings

logger = logging.getLogger(__name__)


class Neo4jClient:
    """
    Neo4j Graph Database Driver client for CrimeGraph AI relationship analytics.
    Provides lazy connection, query execution helpers, and robust error handling.
    """

    def __init__(self):
        self._driver: Optional[Driver] = None

    def connect(self) -> Optional[Driver]:
        if self._driver is None:
            try:
                self._driver = GraphDatabase.driver(
                    settings.NEO4J_URI,
                    auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
                    connection_timeout=2.0
                )
                # Verify connectivity
                self._driver.verify_connectivity()
                logger.info(f"Connected to Neo4j graph database at {settings.NEO4J_URI}")
            except Exception as e:
                logger.warning(
                    f"Neo4j connection could not be established at {settings.NEO4J_URI}: {e}. "
                    f"Graph features will be unavailable until Neo4j is online."
                )
                self._driver = None
        return self._driver

    def close(self):
        if self._driver is not None:
            self._driver.close()
            self._driver = None
            logger.info("Neo4j driver connection closed.")

    def is_connected(self) -> bool:
        if self._driver is None:
            return False
        try:
            self._driver.verify_connectivity()
            return True
        except Exception:
            return False

    def execute_query(self, query: str, parameters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Executes a Cypher read query and returns a list of dictionaries.
        """
        driver = self.connect()
        if not driver:
            raise ConnectionError("Neo4j database connection is not available.")
        
        with driver.session() as session:
            result = session.run(query, parameters or {})
            return [record.data() for record in result]

    def execute_write(self, query: str, parameters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Executes a Cypher write transaction query.
        """
        driver = self.connect()
        if not driver:
            raise ConnectionError("Neo4j database connection is not available.")
        
        with driver.session() as session:
            def _write_tx(tx):
                res = tx.run(query, parameters or {})
                return [record.data() for record in res]
            return session.execute_write(_write_tx)


# Singleton instance
neo4j_client = Neo4jClient()


def get_neo4j():
    """
    FastAPI dependency yielding Neo4j client.
    """
    return neo4j_client
