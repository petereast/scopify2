package scopify.work.backend.service

import scopify.work.backend.model.*

class SessionNotFound(id: String) : Exception("Session with it \"$id\" not found!")
class SessionAlreadyFinished(id: String) : Exception("Session $id already finished!")

class Scopify(val scopeRepo: IScopeRepository) {

    private fun calculateAverageScore(scores: List<ScopeScore>): Double {
        val totalScore: Int = scores.map { item -> item.value }.fold(0) { acc: Int, i: Int -> i + acc }
        return totalScore.toDouble() / scores.size.toDouble()
    }

    fun getById(id: String): ScopeSession? {
        try {
            return scopeRepo.getSession(id)
        } catch (e: Exception) {
            e.printStackTrace()
            throw e
        }
    }

    fun createSession(title: String, description: String): ScopeSession {
        try {
            val scopeSession = ScopeSession(generateId(), title, description)
            scopeRepo.writeSession(scopeSession)
            return scopeSession
        } catch (e: Exception) {
            e.printStackTrace()
            throw e
        }
    }

    fun addScope(sessionId: String, scopeScore: ScopeScore): ScopeSession {
        // Add the score to the scope session
        // Update the session state to InProgress
        try {

            val existingSession = scopeRepo.getSession(sessionId) ?: throw SessionNotFound(sessionId)

            if (existingSession.state == ScopeState.Proposed || existingSession.state == ScopeState.InProgress) {

                val scores = mutableListOf<ScopeScore>()
                scores.addAll(existingSession.scores)
                scores.add(scopeScore)

                val updatedSession = ScopeSession(
                        id = existingSession.id,
                        title = existingSession.title,
                        description = existingSession.description,
                        scores = scores,
                        averageScore = calculateAverageScore(scores),
                        state = ScopeState.InProgress
                )
                scopeRepo.writeSession(updatedSession)

                return updatedSession
            } else {
                throw SessionAlreadyFinished(existingSession.id)
            }
        } catch (e: Exception) {
            e.printStackTrace()
            throw e
        }
    }

    fun finishSession(sessionId: String): ScopeSession {
        try {
            val session = scopeRepo.getSession(sessionId) ?: throw SessionNotFound(sessionId)
            if (session.state == ScopeState.Complete) throw SessionAlreadyFinished(sessionId)

            session.state = ScopeState.Complete
            scopeRepo.writeSession(session)

            return session
        } catch (e: Exception) {
            throw e
        }
    }
}
