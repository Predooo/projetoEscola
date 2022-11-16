CREATE DATABASE  IF NOT EXISTS `taxon` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `taxon`;
-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: taxon
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `classes`
--

DROP TABLE IF EXISTS `classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `classes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text,
  `autor` text,
  `resumo` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `fk_dominios` int DEFAULT NULL,
  `fk_reinos` int DEFAULT NULL,
  `fk_filos` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_dominios` (`fk_dominios`),
  KEY `fk_reinos` (`fk_reinos`),
  KEY `fk_filos` (`fk_filos`),
  CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`fk_dominios`) REFERENCES `dominios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `classes_ibfk_2` FOREIGN KEY (`fk_reinos`) REFERENCES `reinos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `classes_ibfk_3` FOREIGN KEY (`fk_filos`) REFERENCES `filos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classes`
--

LOCK TABLES `classes` WRITE;
/*!40000 ALTER TABLE `classes` DISABLE KEYS */;
INSERT INTO `classes` VALUES (1,'TABELA_CLASSES',NULL,NULL,'2022-09-14 17:55:12','2022-09-14 17:55:12',NULL,NULL,NULL),(2,'Mammalia ','Autores','Sua principal característica é a glândula mamarias nas gêmeas, mas são reconhecidos também por possuírem pelos e serem animais endotérmicos!','2022-09-14 18:33:55','2022-09-14 18:33:55',2,2,3);
/*!40000 ALTER TABLE `classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dominios`
--

DROP TABLE IF EXISTS `dominios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dominios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text,
  `autor` text,
  `resumo` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dominios`
--

LOCK TABLES `dominios` WRITE;
/*!40000 ALTER TABLE `dominios` DISABLE KEYS */;
INSERT INTO `dominios` VALUES (1,'TABELA_DOMINIOS',NULL,NULL,'2022-09-14 17:55:12','2022-09-14 17:55:12'),(2,'Eukaria','Autor',' Organismos vivos unicelulares ou pluricelulares constituídos por células dotadas de núcleo','2022-09-14 18:16:52','2022-09-14 18:16:52'),(3,'Archaea','Autor','São seres vivos procariontes geneticamente distintos das bactérias e eucariontes!','2022-09-14 18:23:44','2022-09-14 18:23:44');
/*!40000 ALTER TABLE `dominios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `especies`
--

DROP TABLE IF EXISTS `especies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `especies` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text,
  `autor` text,
  `resumo` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `fk_dominios` int DEFAULT NULL,
  `fk_reinos` int DEFAULT NULL,
  `fk_filos` int DEFAULT NULL,
  `fk_classes` int DEFAULT NULL,
  `fk_ordens` int DEFAULT NULL,
  `fk_familias` int DEFAULT NULL,
  `fk_generos` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_dominios` (`fk_dominios`),
  KEY `fk_reinos` (`fk_reinos`),
  KEY `fk_filos` (`fk_filos`),
  KEY `fk_classes` (`fk_classes`),
  KEY `fk_ordens` (`fk_ordens`),
  KEY `fk_familias` (`fk_familias`),
  KEY `fk_generos` (`fk_generos`),
  CONSTRAINT `especies_ibfk_1` FOREIGN KEY (`fk_dominios`) REFERENCES `dominios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `especies_ibfk_2` FOREIGN KEY (`fk_reinos`) REFERENCES `reinos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `especies_ibfk_3` FOREIGN KEY (`fk_filos`) REFERENCES `filos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `especies_ibfk_4` FOREIGN KEY (`fk_classes`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `especies_ibfk_5` FOREIGN KEY (`fk_ordens`) REFERENCES `ordens` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `especies_ibfk_6` FOREIGN KEY (`fk_familias`) REFERENCES `familias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `especies_ibfk_7` FOREIGN KEY (`fk_generos`) REFERENCES `generos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `especies`
--

LOCK TABLES `especies` WRITE;
/*!40000 ALTER TABLE `especies` DISABLE KEYS */;
INSERT INTO `especies` VALUES (1,'TABELA_ESPECIES',NULL,NULL,'2022-09-14 17:55:12','2022-09-14 17:55:12',NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'Felis catus','Carolus Linnaeus','Têm um peso variável entre 2,5 a 12 kg coloca a espécie na categoria de animal doméstico de pequeno a médio porte. Vivem em média 15 anos. São predadores naturais de roedores, pequenas aves.','2022-09-14 18:50:31','2022-09-14 18:50:31',2,2,3,2,2,2,2);
/*!40000 ALTER TABLE `especies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `familias`
--

DROP TABLE IF EXISTS `familias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `familias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text,
  `autor` text,
  `resumo` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `fk_dominios` int DEFAULT NULL,
  `fk_reinos` int DEFAULT NULL,
  `fk_filos` int DEFAULT NULL,
  `fk_classes` int DEFAULT NULL,
  `fk_ordens` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_dominios` (`fk_dominios`),
  KEY `fk_reinos` (`fk_reinos`),
  KEY `fk_filos` (`fk_filos`),
  KEY `fk_classes` (`fk_classes`),
  KEY `fk_ordens` (`fk_ordens`),
  CONSTRAINT `familias_ibfk_1` FOREIGN KEY (`fk_dominios`) REFERENCES `dominios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `familias_ibfk_2` FOREIGN KEY (`fk_reinos`) REFERENCES `reinos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `familias_ibfk_3` FOREIGN KEY (`fk_filos`) REFERENCES `filos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `familias_ibfk_4` FOREIGN KEY (`fk_classes`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `familias_ibfk_5` FOREIGN KEY (`fk_ordens`) REFERENCES `ordens` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `familias`
--

LOCK TABLES `familias` WRITE;
/*!40000 ALTER TABLE `familias` DISABLE KEYS */;
INSERT INTO `familias` VALUES (1,'TABELA_FAMILIAS',NULL,NULL,'2022-09-14 17:55:12','2022-09-14 17:55:12',NULL,NULL,NULL,NULL,NULL),(2,'Felidae','Autores','Todos os felídeos, sem exceção, são carnívoros obrigatórios. As espécies selvagens são naturalmente solitárias, com algumas exceções como os leões. Gatos domésticos que vivem em condições selvagens também podem formar colônias. Todos os felídeos são normalmente discretos, comumente apresentam hábitos noturnos e gostam de viver em habitats relativamente inacessíveis.','2022-09-14 18:41:07','2022-09-14 18:41:07',2,2,3,2,2);
/*!40000 ALTER TABLE `familias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `filos`
--

DROP TABLE IF EXISTS `filos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `filos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text,
  `autor` text,
  `resumo` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `fk_dominios` int DEFAULT NULL,
  `fk_reinos` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_dominios` (`fk_dominios`),
  KEY `fk_reinos` (`fk_reinos`),
  CONSTRAINT `filos_ibfk_1` FOREIGN KEY (`fk_dominios`) REFERENCES `dominios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `filos_ibfk_2` FOREIGN KEY (`fk_reinos`) REFERENCES `reinos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `filos`
--

LOCK TABLES `filos` WRITE;
/*!40000 ALTER TABLE `filos` DISABLE KEYS */;
INSERT INTO `filos` VALUES (1,'TABELA_FILOS',NULL,NULL,'2022-09-14 17:55:12','2022-09-14 17:55:12',NULL,NULL),(2,'Porifera','Autor de porífera','São seres vivos pluricelulares, eucariontes, heterotróficos, cujas células formam tecidos biológicos, com capacidade de responder ao ambiente!','2022-09-14 18:20:07','2022-09-14 18:20:07',2,2),(3,'Cordados','Autores','São animais que costumam representar os vertebrados, mas sua principal característica é a notocorda.','2022-09-14 18:29:54','2022-09-14 18:29:54',2,2),(4,'Artropoda','Autores','Resumo de artropoda...','2022-09-14 22:03:27','2022-09-14 22:03:27',2,2),(5,'Novo filo','Autor','Um resuminhoo','2022-09-14 23:50:29','2022-09-14 23:50:29',2,2);
/*!40000 ALTER TABLE `filos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `generos`
--

DROP TABLE IF EXISTS `generos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `generos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text,
  `autor` text,
  `resumo` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `fk_dominios` int DEFAULT NULL,
  `fk_reinos` int DEFAULT NULL,
  `fk_filos` int DEFAULT NULL,
  `fk_classes` int DEFAULT NULL,
  `fk_ordens` int DEFAULT NULL,
  `fk_familias` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_dominios` (`fk_dominios`),
  KEY `fk_reinos` (`fk_reinos`),
  KEY `fk_filos` (`fk_filos`),
  KEY `fk_classes` (`fk_classes`),
  KEY `fk_ordens` (`fk_ordens`),
  KEY `fk_familias` (`fk_familias`),
  CONSTRAINT `generos_ibfk_1` FOREIGN KEY (`fk_dominios`) REFERENCES `dominios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `generos_ibfk_2` FOREIGN KEY (`fk_reinos`) REFERENCES `reinos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `generos_ibfk_3` FOREIGN KEY (`fk_filos`) REFERENCES `filos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `generos_ibfk_4` FOREIGN KEY (`fk_classes`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `generos_ibfk_5` FOREIGN KEY (`fk_ordens`) REFERENCES `ordens` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `generos_ibfk_6` FOREIGN KEY (`fk_familias`) REFERENCES `familias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `generos`
--

LOCK TABLES `generos` WRITE;
/*!40000 ALTER TABLE `generos` DISABLE KEYS */;
INSERT INTO `generos` VALUES (1,'TABELA_GENEROS',NULL,NULL,'2022-09-14 17:55:12','2022-09-14 17:55:12',NULL,NULL,NULL,NULL,NULL,NULL),(2,'Felis','Autores de felis','Este animal conta com ouvidos e olfações bem aguçadas, unhas retráteis, visão noturna avantajada e um corpo bastante flexível. Os olhos de felinos possuem uma camada atrás da retina que funciona como um espelho, com a finalidade de refletir a luz. Também possuem bigode!','2022-09-14 18:46:40','2022-09-14 18:46:40',2,2,3,2,2,2);
/*!40000 ALTER TABLE `generos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagens`
--

DROP TABLE IF EXISTS `imagens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) DEFAULT NULL,
  `originalname` varchar(255) DEFAULT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `fk_dominios` int DEFAULT NULL,
  `fk_reinos` int DEFAULT NULL,
  `fk_filos` int DEFAULT NULL,
  `fk_classes` int DEFAULT NULL,
  `fk_ordens` int DEFAULT NULL,
  `fk_familias` int DEFAULT NULL,
  `fk_generos` int DEFAULT NULL,
  `fk_especies` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_dominios` (`fk_dominios`),
  KEY `fk_reinos` (`fk_reinos`),
  KEY `fk_filos` (`fk_filos`),
  KEY `fk_classes` (`fk_classes`),
  KEY `fk_ordens` (`fk_ordens`),
  KEY `fk_familias` (`fk_familias`),
  KEY `fk_generos` (`fk_generos`),
  KEY `fk_especies` (`fk_especies`),
  CONSTRAINT `imagens_ibfk_1` FOREIGN KEY (`fk_dominios`) REFERENCES `dominios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `imagens_ibfk_2` FOREIGN KEY (`fk_reinos`) REFERENCES `reinos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `imagens_ibfk_3` FOREIGN KEY (`fk_filos`) REFERENCES `filos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `imagens_ibfk_4` FOREIGN KEY (`fk_classes`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `imagens_ibfk_5` FOREIGN KEY (`fk_ordens`) REFERENCES `ordens` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `imagens_ibfk_6` FOREIGN KEY (`fk_familias`) REFERENCES `familias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `imagens_ibfk_7` FOREIGN KEY (`fk_generos`) REFERENCES `generos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `imagens_ibfk_8` FOREIGN KEY (`fk_especies`) REFERENCES `especies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagens`
--

LOCK TABLES `imagens` WRITE;
/*!40000 ALTER TABLE `imagens` DISABLE KEYS */;
INSERT INTO `imagens` VALUES (1,NULL,'TABELA_IMAGENS',NULL,'2022-09-14 17:55:12','2022-09-14 17:55:12',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'Eukaria','imagem_2022-09-14_151743436.png','imagem_2022-09-14_151743436.png1663179289951.png','2022-09-14 18:17:45','2022-09-14 18:17:45',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'Animalia','download (7).jpg','download (7).jpg1663179289951.jpg','2022-09-14 18:19:03','2022-09-14 18:19:03',2,2,NULL,NULL,NULL,NULL,NULL,NULL),(4,'Porifera','images (1).jpg','images (1).jpg1663179289951.jpg','2022-09-14 18:20:24','2022-09-14 18:20:24',2,2,2,NULL,NULL,NULL,NULL,NULL),(5,'Archaea','imagem_2022-09-14_152422052.png','imagem_2022-09-14_152422052.png1663179289951.png','2022-09-14 18:24:23','2022-09-14 18:24:23',3,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,'Plantae','imagem_2022-09-14_152701944.png','imagem_2022-09-14_152701944.png1663179289951.png','2022-09-14 18:27:03','2022-09-14 18:27:03',2,3,NULL,NULL,NULL,NULL,NULL,NULL),(7,'Cordados','imagem_2022-09-14_153034576.png','imagem_2022-09-14_153034576.png1663179289951.png','2022-09-14 18:30:35','2022-09-14 18:30:35',2,2,3,NULL,NULL,NULL,NULL,NULL),(8,'Mammalia ','imagem_2022-09-14_153541621.png','imagem_2022-09-14_153541621.png1663179289951.png','2022-09-14 18:35:43','2022-09-14 18:35:43',2,2,3,2,NULL,NULL,NULL,NULL),(9,'Carnivora','imagem_2022-09-14_153854668.png','imagem_2022-09-14_153854668.png1663179289951.png','2022-09-14 18:39:04','2022-09-14 18:39:04',2,2,3,2,2,NULL,NULL,NULL),(10,'Felidae','imagem_2022-09-14_154138102.png','imagem_2022-09-14_154138102.png1663179289951.png','2022-09-14 18:41:39','2022-09-14 18:41:39',2,2,3,2,2,2,NULL,NULL),(11,'Felis','imagem_2022-09-14_154745206.png','imagem_2022-09-14_154745206.png1663179289951.png','2022-09-14 18:47:46','2022-09-14 18:47:46',2,2,3,2,2,2,2,NULL),(12,'Felis catus','imagem_2022-09-14_155039263.png','imagem_2022-09-14_155039263.png1663179289951.png','2022-09-14 18:50:40','2022-09-14 18:50:40',2,2,3,2,2,2,2,2),(13,'Artropoda','imagem_2022-09-14_190515426.png','imagem_2022-09-14_190515426.png1663192484193.png','2022-09-14 22:05:17','2022-09-14 22:05:17',2,2,4,NULL,NULL,NULL,NULL,NULL),(14,'Novo filo','download (7).jpg','download (7).jpg1663198971845.jpg','2022-09-14 23:51:22','2022-09-14 23:51:22',2,2,5,NULL,NULL,NULL,NULL,NULL),(15,'Novo filo','download (1).jpg','download (1).jpg1663198971845.jpg','2022-09-14 23:56:09','2022-09-14 23:56:09',2,2,5,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `imagens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordens`
--

DROP TABLE IF EXISTS `ordens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text,
  `autor` text,
  `resumo` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `fk_dominios` int DEFAULT NULL,
  `fk_reinos` int DEFAULT NULL,
  `fk_filos` int DEFAULT NULL,
  `fk_classes` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_dominios` (`fk_dominios`),
  KEY `fk_reinos` (`fk_reinos`),
  KEY `fk_filos` (`fk_filos`),
  KEY `fk_classes` (`fk_classes`),
  CONSTRAINT `ordens_ibfk_1` FOREIGN KEY (`fk_dominios`) REFERENCES `dominios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ordens_ibfk_2` FOREIGN KEY (`fk_reinos`) REFERENCES `reinos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ordens_ibfk_3` FOREIGN KEY (`fk_filos`) REFERENCES `filos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ordens_ibfk_4` FOREIGN KEY (`fk_classes`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordens`
--

LOCK TABLES `ordens` WRITE;
/*!40000 ALTER TABLE `ordens` DISABLE KEYS */;
INSERT INTO `ordens` VALUES (1,'TABELA_ORDENS',NULL,NULL,'2022-09-14 17:55:12','2022-09-14 17:55:12',NULL,NULL,NULL,NULL),(2,'Carnivora','Autor','São animais que possuem placenta em seu desenvolvimento embrionário e possuem pés com quatro ou cinco dedos, apresentando garras, machos com báculo e dentes adaptados para cortar, com presença de caninos fortes, cônicos e pontiagudos!','2022-09-14 18:38:06','2022-09-14 18:38:06',2,2,3,2);
/*!40000 ALTER TABLE `ordens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pesquisas`
--

DROP TABLE IF EXISTS `pesquisas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pesquisas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `originalname` text,
  `fileName` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `fk_dominios` int DEFAULT NULL,
  `fk_reinos` int DEFAULT NULL,
  `fk_filos` int DEFAULT NULL,
  `fk_classes` int DEFAULT NULL,
  `fk_ordens` int DEFAULT NULL,
  `fk_familias` int DEFAULT NULL,
  `fk_generos` int DEFAULT NULL,
  `fk_especies` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_dominios` (`fk_dominios`),
  KEY `fk_reinos` (`fk_reinos`),
  KEY `fk_filos` (`fk_filos`),
  KEY `fk_classes` (`fk_classes`),
  KEY `fk_ordens` (`fk_ordens`),
  KEY `fk_familias` (`fk_familias`),
  KEY `fk_generos` (`fk_generos`),
  KEY `fk_especies` (`fk_especies`),
  CONSTRAINT `pesquisas_ibfk_1` FOREIGN KEY (`fk_dominios`) REFERENCES `dominios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pesquisas_ibfk_2` FOREIGN KEY (`fk_reinos`) REFERENCES `reinos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pesquisas_ibfk_3` FOREIGN KEY (`fk_filos`) REFERENCES `filos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pesquisas_ibfk_4` FOREIGN KEY (`fk_classes`) REFERENCES `classes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pesquisas_ibfk_5` FOREIGN KEY (`fk_ordens`) REFERENCES `ordens` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pesquisas_ibfk_6` FOREIGN KEY (`fk_familias`) REFERENCES `familias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pesquisas_ibfk_7` FOREIGN KEY (`fk_generos`) REFERENCES `generos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pesquisas_ibfk_8` FOREIGN KEY (`fk_especies`) REFERENCES `especies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pesquisas`
--

LOCK TABLES `pesquisas` WRITE;
/*!40000 ALTER TABLE `pesquisas` DISABLE KEYS */;
INSERT INTO `pesquisas` VALUES (1,'TABELA_PESQUISAS',NULL,'2022-09-14 17:55:12','2022-09-14 17:55:12',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'Aritigo descrevendo reino.pdf','Aritigo descrevendo reino.pdf1663179289951.pdf','2022-09-14 18:17:45','2022-09-14 18:17:45',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'Aritigo descrevendo reino.pdf','Aritigo descrevendo reino.pdf1663179289951.pdf','2022-09-14 18:19:03','2022-09-14 18:19:03',2,2,NULL,NULL,NULL,NULL,NULL,NULL),(4,'Aritigo descrevendo filo.pdf','Aritigo descrevendo filo.pdf1663179289951.pdf','2022-09-14 18:20:24','2022-09-14 18:20:24',2,2,2,NULL,NULL,NULL,NULL,NULL),(5,'Aritigo descrevendo reino.pdf','Aritigo descrevendo reino.pdf1663179289951.pdf','2022-09-14 18:24:23','2022-09-14 18:24:23',3,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,'Aritigo descrevendo reino.pdf','Aritigo descrevendo reino.pdf1663179289951.pdf','2022-09-14 18:27:03','2022-09-14 18:27:03',2,3,NULL,NULL,NULL,NULL,NULL,NULL),(7,'Aritigo descrevendo filo.pdf','Aritigo descrevendo filo.pdf1663179289951.pdf','2022-09-14 18:30:35','2022-09-14 18:30:35',2,2,3,NULL,NULL,NULL,NULL,NULL),(8,'Aritigo descrevendo classes de mamiferos.pdf','Aritigo descrevendo classes de mamiferos.pdf1663179289951.pdf','2022-09-14 18:35:43','2022-09-14 18:35:43',2,2,3,2,NULL,NULL,NULL,NULL),(9,'Aritigo descrevendo ordem.pdf','Aritigo descrevendo ordem.pdf1663179289951.pdf','2022-09-14 18:39:04','2022-09-14 18:39:04',2,2,3,2,2,NULL,NULL,NULL),(10,'Aritigo descrevendo familia.pdf','Aritigo descrevendo familia.pdf1663179289951.pdf','2022-09-14 18:41:39','2022-09-14 18:41:39',2,2,3,2,2,2,NULL,NULL),(11,'Aritigo descrevendo GENERO.pdf','Aritigo descrevendo GENERO.pdf1663179289951.pdf','2022-09-14 18:47:46','2022-09-14 18:47:46',2,2,3,2,2,2,2,NULL),(12,'Aritigo descrevendo ESPECIE.pdf','Aritigo descrevendo ESPECIE.pdf1663179289951.pdf','2022-09-14 18:50:40','2022-09-14 18:50:40',2,2,3,2,2,2,2,2),(13,'Aritigo descrevendo filo.pdf','Aritigo descrevendo filo.pdf1663192484193.pdf','2022-09-14 22:05:17','2022-09-14 22:05:17',2,2,4,NULL,NULL,NULL,NULL,NULL),(14,'Aritigo descrevendo filo.pdf','Aritigo descrevendo filo.pdf1663198971845.pdf','2022-09-14 23:51:22','2022-09-14 23:51:22',2,2,5,NULL,NULL,NULL,NULL,NULL),(15,'Aritigo descrevendo ESPECIE.pdf','Aritigo descrevendo ESPECIE.pdf1663198971845.pdf','2022-09-14 23:56:09','2022-09-14 23:56:09',2,2,5,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `pesquisas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reinos`
--

DROP TABLE IF EXISTS `reinos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reinos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` text,
  `autor` text,
  `resumo` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `fk_dominios` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_dominios` (`fk_dominios`),
  CONSTRAINT `reinos_ibfk_1` FOREIGN KEY (`fk_dominios`) REFERENCES `dominios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reinos`
--

LOCK TABLES `reinos` WRITE;
/*!40000 ALTER TABLE `reinos` DISABLE KEYS */;
INSERT INTO `reinos` VALUES (1,'TABELA_REINOS',NULL,NULL,'2022-09-14 17:55:12','2022-09-14 17:55:12',NULL),(2,'Animalia','Autor','São seres vivos pluricelulares, eucariontes, heterotróficos, cujas células formam tecidos biológicos, com capacidade de responder ao ambiente','2022-09-14 18:18:49','2022-09-14 18:18:49',2),(3,'Plantae','Autores...','São organismos eucariotas multicelulares, sem motilidade e predominantemente autotróficos fotossintéticos!','2022-09-14 18:25:49','2022-09-14 18:25:49',2);
/*!40000 ALTER TABLE `reinos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) DEFAULT NULL,
  `sobrenome` varchar(255) DEFAULT NULL,
  `formacao` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'TABELA_USUARIOS',NULL,NULL,NULL,NULL,'2022-02-05 21:03:59','2022-02-05 21:03:59'),(51,'Pedro','Potulski','Biologo','pedrinhoo@gmail.com','$2a$10$Py4b8JLOZ6POgtlqqz6ApeTKLKM36slcyvqfhTi89/a1eLE42rZsC','2022-09-10 19:23:45','2022-09-10 19:23:45');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-16 13:41:53
