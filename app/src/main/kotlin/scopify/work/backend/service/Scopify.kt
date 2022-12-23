package scopify.work.backend.service

import scopify.work.backend.model.*

class SessionNotFound(id: String) : Exception("Session with it \"$id\" not found!")
class SessionAlreadyFinished(id: String) : Exception("Session $id already finished!")

class Scopify(private val scopeRepo: IScopeRepository) {

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

    fun createSession(title: String, description: String, groupId: String? = null): ScopeSession {
      
        try {
            val scopeSession = ScopeSession(generateId(), title, description, group = groupId)
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
                    group = existingSession.group,
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

            val newSession = session.copy(state = ScopeState.Complete)

            scopeRepo.writeSession(newSession)

            return session
        } catch (e: Exception) {
            throw e
        }
    }

    fun getScopeGroup(id: String): ScopeGroup? {
      return scopeRepo.getGroup(id)
    }

    fun createScopeGroup(title: String): ScopeGroup {
      return requireNotNull(scopeRepo.createGroup(generateId(), title))
    }

    fun getGroupScopes(id: String): List<String> {
      return scopeRepo.getGroupScopes(id)
    }
}
